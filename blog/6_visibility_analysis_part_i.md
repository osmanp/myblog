---
id: '5'
date: '2020-04-29T04:13:56+00:00'
title: 'Visibility analysis Part I: Line-of-sight'
template: post
thumbnail: '../thumbnails/qt.png'
slug: gis-algorithms-los
readtime: '10 min'
categories:  
  - GIS
  - C++
tags:
  - GIS   
  - C++
  - Qt
  - Algorithms
---

Visibility analysis is commonly used in GIS based applications. Line-of-sight algorithm means calculating visibility of observer and observant on elevation data. There are many implementations about LOS in terms of context. You can use it in electromagnetic propagation or map applications with different approaches. In this article, i will show how to load a height map on Qt application and give a slight representation of real-world visibility approach. One can use different height data like tiff,geotiff,dted etc. for simplicity i will use a grayscale image format without real world coordinates. Adding coordinates and other formats follows a similar path and requires a little more coding.

## Main Qt Application design

Qt is a powerful tool for UI application development with C++ but not  supports GIS applications. It gives enough power for developing UI and logic side, but not provide a GIS library inside. You can entegrate it with some open source libraries like  [QGIS](https://qgis.org/tr/site/) or if you need just GIS map data support use [GDAL](https://gdal.org/) lib. For rendering a grayscale image you can use QGraphicsScene class. It is enough for rendering our height map and catching events. 

First, design a map view and 2D profile view with QtDesigner on our application form.

![](../images/qt_application_form.jpg)

There are 3 buttons, *(ignore viewshed now, it will be in the next article)* and 2 QGraphicsView. Bigger one is for map rendering, smaller one is for height profiling.

Lets promote widgets into our classes.
```c++
#pragma once

#include <QtWidgets/QMainWindow>
#include <qpushbutton.h>
#include "ui_QtMapViewer.h"

class QtMapViewer : public QMainWindow
{
	Q_OBJECT

public:
	QtMapViewer(QWidget *parent = Q_NULLPTR);

private:
	Ui::QtMapViewerClass ui;

signals:
	void newMapLoaded(QString mapFile);
	void analizeLOS();
	void analizeViewShed();

private slots:
	void onLoadMapClicked();
	void onLosAnalysisClicked();
	void onViewShedAnalysisClicked();
};


```
Here is the implementation of our MapView class. It is straight forward, contains slots and signals for subwidgets. 

```c++
#include "QtMapViewer.h"
#include "qpushbutton.h"
#include <iostream>
#include <qmessagebox.h>
#include <qfiledialog.h>
#include <qimage.h>
#include <qpixmap.h>
#include <qgraphicsitem.h>
#include <qgraphicssceneevent.h>
#include <qstringbuilder.h>
#include "MapView.h"

QtMapViewer::QtMapViewer(QWidget *parent)
	: QMainWindow(parent)
{
	ui.setupUi(this);
	QObject::connect(ui.loadMapButton, SIGNAL(clicked()), this, SLOT(onLoadMapClicked()));
	QObject::connect(ui.losButton, SIGNAL(clicked()), this, SLOT(onLosAnalysisClicked()));

	QObject::connect(this, SIGNAL(newMapLoaded(QString)), ui.mainView, SLOT(onNewMapLoaded(QString)));
	QObject::connect(this, SIGNAL(newMapLoaded(QString)), ui.consoleView, SLOT(onNewMapLoaded(QString)));


	QObject::connect(ui.mainView, SIGNAL(lineSelected(QLine,QRect)), ui.consoleView, SLOT(onLineSelected(QLine, QRect)));
}

void QtMapViewer::onLoadMapClicked() {
	QString fileName = QFileDialog::getOpenFileName(this,tr("Open Image"), ".");	
	emit this->newMapLoaded(fileName);	
}

void QtMapViewer::onLosAnalysisClicked() {
	ui.mainView->setMode(AnalysisMode::LOS);
}

void QtMapViewer::onViewShedAnalysisClicked() {
	ui.mainView->setMode(AnalysisMode::VIEWSHED);
}
```

## Rendering height map

Now, we will put our promoted class, *MapView.h*. It inherits from  QGraphicsScene and should take filepath from main window.

```c++
#pragma once
#include <qgraphicsview.h>
#include <qevent.h>
#include <qstring.h>
#include <qqueue.h>
#include "VisibilityAnalysis.h"

enum AnalysisMode {
	NONE = 1,
	VIEWSHED = 2,
	LOS = 3
};

class MapView : public QGraphicsView
{
	Q_OBJECT
	
public: 
	MapView(QWidget* parent);
	void setMode(AnalysisMode mode);

public slots:
	void onNewMapLoaded(QString filename);
	

protected:
	virtual void mousePressEvent(QMouseEvent * event);
	virtual void drawBackground(QPainter *painter, const QRectF &rect);
	virtual void paintEvent(QPaintEvent *paintEvent);
	
signals:
	void mouseClicked(QString pos);
	void lineSelected(QLine line, QRect screenRect);

	AnalysisMode mMode;
	QImage mElevationMap;
	QQueue<QPoint> mPointList;
	VisibilityAnalysis* mAnalysis;
};

```

The *lineSelected* signal is for sending a line information to our 2D profiler window. For rendering map and drawing on it, you should implement 2 base methods: 
- "virtual void drawBackground(QPainter *painter, const QRectF &rect);"
- "virtual void paintEvent(QPaintEvent *paintEvent);"

First, methods is for putting map on backgroud. Second one is for rendering our custom graphic items.

```c++
#include "MapView.h"
#include <qgraphicssceneevent.h>
#include <qgraphicsscene.h>
#include <qrect.h>
#include <qpen.h>
#include <qgraphicsitem.h>

MapView::MapView(QWidget* parent) :QGraphicsView(parent) {
	this->mAnalysis = NULL;
	this->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
	this->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
	this->setMouseTracking(true);
	this->mRadius = 100;
	this->setMode(AnalysisMode::NONE);
}

void MapView::setMode(AnalysisMode mode) {
	this->mMode = mode;
}

void MapView::mousePressEvent(QMouseEvent * event)
{
	QGraphicsView::mousePressEvent(event);
	const QPoint pos = event->pos();

	switch (mMode)
	{
	case AnalysisMode::NONE:
		return;
	case AnalysisMode::LOS:
		mPointList.push_back(pos);
		if (mPointList.size() > 2) {
			mPointList.pop_front();
		}
		if (mPointList.size() == 2) {
			emit lineSelected(QLine(mPointList.first(), mPointList.last()), QRect(0, 0, this->width(), this->height()));
		}
		return;
	case AnalysisMode::VIEWSHED:
		return;
	default:
		break;
	}
	const QRect screenRect = QRect(0, 0, this->width(), this->height());

	emit mouseClicked("position x : " + QString::number(pos.x()) + " position y" + QString::number(pos.y()));
	this->repaint();
}

void MapView::onNewMapLoaded(QString filename) {
	this->mElevationMap = QImage(filename);
	this->mAnalysis = new VisibilityAnalysis(this->mElevationMap);
}

void MapView::drawBackground(QPainter * painter, const QRectF & rect)
{
	QGraphicsView::drawBackground(painter, rect);
	if (!this->mElevationMap.isNull()) {
		painter->drawImage(rect, QImage(this->mElevationMap));
	}
}

void MapView::paintEvent(QPaintEvent * paintEvent)
{
	QGraphicsView::paintEvent(paintEvent);

	const QRect screenRect = QRect(0, 0, this->width(), this->height());
	QPainter painter(this->viewport());
	this->drawBackground(&painter, screenRect);

	if (mPointList.size() > 0) {
		painter.setPen(QPen(Qt::black));
		for (auto point = mPointList.begin(); point != mPointList.end(); point++) {
			painter.setBrush(QBrush(Qt::green));
			painter.drawEllipse(point->x() - 8, point->y() - 8, 16, 16);
			painter.setBrush(QBrush(Qt::white));
			painter.drawEllipse(point->x() - 3, point->y() - 3, 6, 6);
		}
	}
	switch (mMode)
	{
	case AnalysisMode::NONE:
		break;
	case AnalysisMode::LOS:
		if (mPointList.size() > 1) {
			painter.drawLine(mPointList.first(), mPointList.last());
		}
		break;
	case AnalysisMode::VIEWSHED:
	default:
		break;
	}
	this->viewport()->update();
}

```

Seperating our implementation code is important, all our logic will be done at *VisibilityAnalysis* class. We will need 2 points on map for line-of-sight analysis. A queue holds clicked points for two, then clears.

After selecting a grayscale height map, you will see a screen like this. You can use GeoTIFF, DTED or any other source. What you need to do is just read your source with GDAL and generate a QImage for background in grayscale. This elevation data is uint16 grayscale image.

![](../images/qt_application_1.jpg)


## Rendering height profile

2D profile of elevation data is important in GIS applications. You can use QPolygon for a good view of chart.

ChartView.h code:
```c++

#include <qgraphicsview.h>
#include "VisibilityAnalysis.h"

class ChartView : public QGraphicsView
{
	Q_OBJECT
public:
	ChartView(QWidget* parent);
	
	virtual void paintEvent(QPaintEvent *paintEvent);

public slots:
	void onNewMapLoaded(QString filename);
	void onLineSelected(QLine line, QRect screenRect);

private:
	void ChartView::drawPolygon(QPainter& painter, const QRect& sceneRect, QList<QPoint> pointList);

	QList<QPoint> mCoordinates;
	QList<QPoint> mHeightList;
	QImage mElevationMap;
	VisibilityAnalysis* mAnalysis;
};

```

And here is the implementation:

```c++
#include "ChartView.h"
#include <qbrush.h>
#include <math.h>
#include <qdatetime.h>
#include <qfile.h>
#include <ctime>

ChartView::ChartView(QWidget* parent) :QGraphicsView(parent) {
	this->setBackgroundBrush(Qt::white);
	this->update();
	std::srand(std::time(nullptr));
}

void ChartView::onNewMapLoaded(QString filename) {
	QFile file(filename);
	file.open(QIODevice::ReadOnly);
	this->mElevationMap = QImage::fromData(file.readAll());
	mAnalysis = new VisibilityAnalysis(this->mElevationMap);
}


void ChartView::onLineSelected(QLine line, QRect screenRect) {
	
	auto imageWidth = mElevationMap.width();
	auto scaleX = (float)mElevationMap.width() / screenRect.width() ;
	auto scaleY = (float)mElevationMap.height() / screenRect.height();
	QPoint startCoordinate(line.p1().x() * scaleX, line.p1().y() * scaleY);
	QPoint endCoordinate(line.p2().x() * scaleX, line.p2().y() * scaleY);
	
	QList<int> heightList = this->mAnalysis->listHeightBetween(startCoordinate, endCoordinate);

	mCoordinates.clear();
	this->mAnalysis->collectPoints(startCoordinate.x(), startCoordinate.y(), endCoordinate.x(), endCoordinate.y(), this->mCoordinates);

	mHeightList.clear();
	auto horizentalSteps = static_cast<float>(this->width()) / heightList.length();
	for (auto heightIndex = 0; heightIndex < heightList.length(); heightIndex++) {
		auto drawY =  256 - heightList[heightIndex];
		mHeightList.push_back(QPoint(static_cast<int>(std::ceil(horizentalSteps * heightIndex)), drawY));
	}
}

void drawLines(QPainter& painter,const QRect& sceneRect) {
	auto totalHeight = sceneRect.height();
	auto indexJump = totalHeight / 5;
	painter.setPen(Qt::PenStyle::DashDotLine);
	for (int i = 1; i < 5; i++) {
		QPoint start(0, sceneRect.top() + indexJump * i);
		QPoint end(sceneRect.right(), sceneRect.top() + indexJump * i );
		painter.drawLine(start, end);
		painter.drawText(start, QString::number(i * 1000));
	}
}

void ChartView::drawPolygon(QPainter& painter, const QRect& sceneRect, QList<QPoint> pointList) {
	auto startHeight = pointList.first();
	auto endHeight = pointList.last();
		
	painter.setPen(Qt::black);
	pointList.push_back(sceneRect.bottomRight());
	pointList.push_front(sceneRect.bottomLeft());
	painter.setBrush(Qt::green);
	painter.drawPolygon(pointList.toVector().data(),pointList.length());

	bool isVisible = this->mAnalysis->isVisible(mCoordinates.first(), mCoordinates.last());
	if (isVisible) {
		painter.setPen(QPen(QBrush( Qt::darkGreen),6,Qt::PenStyle::SolidLine));
	}
	else {
		painter.setPen(QPen(QBrush(Qt::red), 6, Qt::PenStyle::SolidLine));
	}
	
	painter.drawLine(startHeight, endHeight);
}


void ChartView::paintEvent(QPaintEvent * paintEvent)
{
	QGraphicsView::paintEvent(paintEvent);
	const QRect screenRect = QRect(0, 0, this->width(), this->height());
	QPainter painter(this->viewport());

	
	if (mHeightList.length() > 0)
		drawPolygon(painter, screenRect, mHeightList);

	drawLines(painter, screenRect);
	
	this->viewport()->update();
}

```

Important point here is, you have to scale your view coordinates to map coordinates. Code below do the scaling for view <-> scene transformation. If you have actual world coordinates, it will be similar like this, you will use top left coordinate with resolution of your map data for calculation.

```c++
	auto imageWidth = mElevationMap.width();
	auto scaleX = (float)mElevationMap.width() / screenRect.width() ;
	auto scaleY = (float)mElevationMap.height() / screenRect.height();
	QPoint startCoordinate(line.p1().x() * scaleX, line.p1().y() * scaleY);
	QPoint endCoordinate(line.p2().x() * scaleX, line.p2().y() * scaleY);
```

Putting first and last point for having a correct view of chart is important. 
Again, heights are imaginary, for correct data you have to use a correct elevation data with known features. Final version of view will be like this.  


![](../images/qt_application_1.jpg)


## Visibility analysis

I will collect grid data points with [Bresenham's line algorithm ](https://www.wikiwand.com/en/Bresenham%27s_line_algorithm). It is basically a line drawing algorithm. You can collect grid coordinates of line by Bresenham's algorithm and query height from source data for profiling.

VisibilityAnalysis.h
```c++
#pragma once

#include <qpoint.h>
#include <qimage.h>


class VisibilityAnalysis
{
public:
	VisibilityAnalysis(QImage heightMap);

	bool isVisible(QPoint start, QPoint end);

	QList<int> listHeightBetween(QPoint start, QPoint end);

	void collectPoints(int x1, int y1, int x2, int y2, QList<QPoint>& points);
private:
	QImage  mHeightMap;
};

```

And here is the implementation:
```c++
#include "VisibilityAnalysis.h"

VisibilityAnalysis::VisibilityAnalysis(QImage heightMap) {
	this->mHeightMap = heightMap;
}

int convertRGBToHeight(QColor color, int max) {
	return ((256- ((color.red() + color.green() + color.blue()) / 3)));
}

bool VisibilityAnalysis::isVisible(QPoint start, QPoint end) {
	auto firstHeight = convertRGBToHeight(this->mHeightMap.pixelColor(start),4000) + 40;
	auto secondHeight = convertRGBToHeight(this->mHeightMap.pixelColor(end), 4000) + 40;
	auto distance = std::sqrt(std::pow(start.x() - end.x(), 2) + std::pow(start.y() - end.y(), 2));
	
	auto heightList = this->listHeightBetween(start, end);
	auto slope = static_cast<float>(secondHeight - firstHeight) / heightList.length();

	for (auto index = 0; index < heightList.length(); index++) {
		firstHeight += slope;
		auto currentHeight = heightList.at(index);
		if (currentHeight > firstHeight) {
			return false;
		}
	}
	return true;
}


// Bresenham's line algorithm
void VisibilityAnalysis::collectPoints(int x1, int y1, int x2, int y2, QList<QPoint>& points)
{
	const bool steep = (fabs(y2 - y1) > fabs(x2 - x1));
	if (steep)
	{
		std::swap(x1, y1);
		std::swap(x2, y2);
	}

	if (x1 > x2)
	{
		std::swap(x1, x2);
		std::swap(y1, y2);
	}

	const float dx = x2 - x1;
	const float dy = fabs(y2 - y1);

	float error = dx / 2.0f;
	const int ystep = (y1 < y2) ? 1 : -1;
	int y = (int)y1;

	const int maxX = (int)x2;

	for (int x = (int)x1; x <= maxX; x++)
	{
		if (steep)
		{
			points.push_front(QPoint(y, x));
		}
		else
		{
			points.push_front(QPoint(x, y));
		}

		error -= dy;
		if (error < 0)
		{
			y += ystep;
			error += dx;
		}
	}
}

QList<int> VisibilityAnalysis::listHeightBetween(QPoint start, QPoint end) {
	QList<QPoint> linePoints;
	this->collectPoints(start.x(), start.y(), end.x(), end.y(), linePoints);
	QList<int> heightList;
	for (auto coordinate = linePoints.begin(); coordinate != linePoints.end(); coordinate++) {
		const QPoint imageCoordinate(coordinate->x(), coordinate->y());
		auto height = mHeightMap.pixelColor(imageCoordinate);
		heightList.push_back(convertRGBToHeight(height, 4000));
	}
	return heightList;
}
```

## Final results 

After putting it all together. You should end up a view like this screenshots. Also put a line in chart with red or green color which shows visibility. It is a bit ugly and thick :). You can continue with integrating GeoTIFF or DTED with the help of GDAL library.


![](../images/qt_application_3.jpg)


![](../images/qt_application_4.jpg)