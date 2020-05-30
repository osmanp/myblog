---
id: '7'
date: '2020-04-30T04:13:56+00:00'
title: 'Visibility analysis Part II: Viewshed'
template: post
thumbnail: '../thumbnails/qt.png'
slug: gis-algorithms-viewshed
popularity: '7'
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

In previous articles, you can see [Line-of-sight and a sample map rendering article for  visibility analysis](). Now, you will see the missing part of visibility analysis. Viewshed algorithm basically shows you which part by the observer. There are many algorithms for viewshed analysis.

- R3
- R2
- Van Kreveld sweep algorithm
- parallel viewshed analysis

I will introduce R3 algorithm, it is known as exact method and used for benchmarking other algorithms. R3 algorithm is a brute-force solution actually, it requires massive processing for generating exact results.

In this post, i will not show application design or other parts. You can find them in part one of this series.

## Rendering map with viewshed image

In first part, we just put points on the map, now i will add an image for displaying viewshed.

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

private:
	void calculateViewshed(QPoint center);

	AnalysisMode mMode;
	QImage mElevationMap;
	QImage mViewShed;
	QQueue<QPoint> mPointList;
	VisibilityAnalysis* mAnalysis;
	int mRadius;
};
```

This view has 2 modes for viewshed and LOS analysis, viewshed just requires one point for generating visibility image.

```c++

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
		mPointList.clear();
		this->calculateViewshed(pos);
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

void MapView::calculateViewshed(QPoint center) {
	const QRect screenRect = QRect(0, 0, this->width(), this->height());
	auto scaleX = (float)mElevationMap.width() / screenRect.width();
	auto scaleY = (float)mElevationMap.height() / screenRect.height();

	QPoint newCenter(center.x() * scaleX, center.y() * scaleY);
	if (this->mAnalysis) {
		mViewShed = this->mAnalysis->calculateViewShed(newCenter, mRadius);
		mPointList.clear();
		mPointList.push_front(center);
	}
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
		if (!mViewShed.isNull()) {
			const QPoint imageCenter(mPointList.first().x() - mRadius, mPointList.first().y() - mRadius );
			painter.setPen(Qt::black);
			painter.setBrush(Qt::BrushStyle::NoBrush);
			painter.drawEllipse(mPointList.first(), mRadius, mRadius);
			painter.drawImage(imageCenter, mViewShed);
		}
		break;
	default:
		break;
	}
	this->viewport()->update();
}

```

Rendering viewshed results are obvious, one image, one ellipse for borders.

```c++
	case AnalysisMode::VIEWSHED:
		if (!mViewShed.isNull()) {
			const QPoint imageCenter(mPointList.first().x() - mRadius, mPointList.first().y() - mRadius );
			painter.setPen(Qt::black);
			painter.setBrush(Qt::BrushStyle::NoBrush);
			painter.drawEllipse(mPointList.first(), mRadius, mRadius);
			painter.drawImage(imageCenter, mViewShed);
		}
		break;
```

##  Viewshed analysis

There are some tricks about this analysis code. Here, for getting a circle view, i just cut out pixels that are more distant than radius. Cutting out means, setting alpha value 0, that makes them invisible. Visible parts are *qRgba(0, 255, 0, 80)* with alpha for a better view, and non visible areas are red version of visible ones.

```c++
QImage VisibilityAnalysis::calculateViewShed(QPoint center, int radius) {
	QRect rect(QPoint(center.x() - radius, center.y() - radius), QPoint(center.x() + radius, center.y() + radius));

	QImage viewShed(radius * 2, radius * 2, QImage::Format_ARGB32);
	
	int imageX = 0;
	int visibleCount = 0;
	for (int x = rect.topLeft().x() ; x < rect.topRight().x(); x++) {
		int imageY = 0;
		for (int y = rect.topLeft().y(); y < rect.bottomRight().y(); y++) {
			bool isVisible = this->isVisible(QPoint(x, y), center);
			if (isVisible) {
				visibleCount++;
			}
			auto distance = std::sqrt(std::pow(radius - imageX, 2) + std::pow(radius - imageY, 2));
			if (distance > radius) {
				viewShed.setPixel(QPoint(imageX, imageY), qRgba(0, 0, 0,0));
			}
			else {
				viewShed.setPixel(QPoint(imageX, imageY), !isVisible ? qRgba(255, 0, 0,80) : qRgba(0, 255, 0, 80));
			}
			
			imageY++;
		}
		imageX++;
	}
	return viewShed;
}
```

## Final results 

Here are some results of our viewshed. In the future, i will add other algorithms and show a realtime viewshed analyzer.

![](../images/qt_application_5.jpg)


![](../images/qt_application_6.jpg)