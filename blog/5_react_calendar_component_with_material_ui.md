---
id: '5'
date: '2020-04-23T04:13:56+00:00'
title: 'React calendar component with material-ui'
template: post
thumbnail: '../thumbnails/react.png'
slug: react-calendar-component
readtime: '10 min'
categories:  
  - React
  - Javascript
tags:
  - MomentJS   
  - Javascript
  - React
  - Material-UI
---

In this post, I will show an example Calendar component   with React, Material-UI and moment.js. It is true that i will inspired by google calendar. I will try to use only react no more redux or some other libraries. With the help of react-hooks, i will show events and share them across hierarchy. After reading tutorial you will have a common knowledge about grid design and some insight about data manipulating with moment.js. 

There are alternatives like Luxon for date and time manipulation, for general, my choice always will be moment.js. May be, if you need some interval arithmetic, you may need Luxon.

This *Calendar* component will show a monthly view, you can add note or meetings in your schedule.  

## Daily View Component

Lets start design inside out. First component is the daily view. Features for daily view are
- View current day in different background
- If first week of month, show month info
- If last week of month show next month's info
- Daily note and meetings

Start view props for daily view. *onHandleDayClick* will be received from upper components, because this components will not manage daily event or meetings, it will just propagate. Also a sort is required for showing events on chronological order.

```javascript
const CalendarDayView = ({
  date,
  firstWeek,
  nextMonth,
  events,
  onHandleDayClick,
}) => {
  const classes = useStyles();
  const currentDay = moment(date);
  const sortedEvents = events.sort((x, y) =>
    moment(x.date.start).isBefore(moment(y.date.start), "minute")
  );
  return (
    <>
    </>
  )
}
``` 

Lets style with grid layout.I will add some empty grid columns for providing a better look. Here is the day component.It is a grid surrounded by a div. 

```javascript
      <div
        style={{
          backgroundColor: !moment(date).isSame(moment(), "day")
            ? "#ffffff"
            : "#f0ece4",
        }}
        className={classes.root}
        onClick={() => onClickEvent(null)}
      >
        <Grid container direction="column" justify="flex-start">
          <Grid item xs={12}>
            {firstWeek ? (
              <Typography
                variant="subtitle2"
                align="center"
                className={classes.firstWeek}
              >
                <b>{currentDay.format("dd")}</b>
              </Typography>
            ) : null}
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={2} className={classes.dayHeader}>
              <Typography align="center" variant="subtitle2">
                {(nextMonth ? currentDay.format("MMM") + " " : "") +
                  currentDay.date()}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}></Grid>

          <Grid
            container
            item
            xs
            direction="column"
            justify="flex-start"
            className={classes.eventContainer}
          >
            {sortedEvents
              ? sortedEvents.map((event, index) => {
                  return event.type === "meeting" ? (
                    <CalendarMeeting
                      event={event}
                      onClickEvent={onClickEvent}
                    ></CalendarMeeting>
                  ) : (
                    <CalendarNote
                      event={event}
                      onClickEvent={onClickEvent}
                    ></CalendarNote>
                  );
                })
              : null}
          </Grid>
        </Grid>
      </div>
    </>
```

### Calendar meeting

Every meeting will be shown with a icon and time ranges. It is a super simple component. It also receives a click function from upper component for selecting event is clicked. 

```javascript
const CalendarMeeting = ({ event,onClickEvent }) => {  
  const classes = useStyles();

  const onClickMeeting = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClickEvent(event);
  }
  return (
    <div className={classes.root} onClick={onClickMeeting}>
    <Paper style={{ backgroundColor: "#95ddf5" }}>
      <Grid item xs>
        <Grid
          container
          item
          alignItems="center"
          direction="row"
          justify="center"
          alignContent="center"
        >
          <Grid item xs={2} style={{ marginTop: "4px" }}>
            <MeetingRoomIcon fontSize="small"></MeetingRoomIcon>
          </Grid>
          <Grid item xs  style={{}}>
          <Typography
              className={classes.eventInfo}
            >
           {moment(event.date.start).format('HH a') + ' - ' + moment(event.date.end).format('HH a')}
           </Typography>
           
          </Grid>
        </Grid>
      </Grid>
    </Paper>
    </div>
  );
```

### Calendar note

It is also same with some coloring and style difference.

```javascript
const CalendarNote = ({ event, onClickEvent }) => {
  const classes = useStyles();
  const onClickNote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClickEvent(event);
  };
  return (
    <div className={classes.root} onClick={onClickNote}>
      <Paper
        style={{
          backgroundColor: "#8cf58c",
        }}
      >
        <Grid
          item
          container
          alignContent="flex-start"
          alignItems="stretch"
          direction="row"
        >
          <Grid item xs={2} style={{ marginTop: "4px" }}>
            <EventIcon fontSize="small"></EventIcon>
          </Grid>
          <Grid item xs style={{}}>
            <Typography
              className={classes.eventInfo}
            >
              {moment(event.date.start).format("HH a") +
                " - " +
                moment(event.date.end).format("HH a")}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default CalendarNote;
```


## Weekly view component

I will not try to build an 2 dimensional array like grid layout. There are 2 reasons for that, first of all, it is harder than you think :) using a week by week components make your life easier with less calculations.Secondly, as i said before, we need information for first and last week, having week based components provides a more natural design for our data.

Here is the component code. *Array.from* provides ordered integer arrays. simple for 1-7 array in this case. *moment.add()* is useful and easy for date arithmetic. Also, it is chainable and makes your code more readable.

```javascript
import { Grid } from "@material-ui/core";
import moment from "moment";
import React from "react";
import CalendarDayView from "./CalendarDayView";

const CalendarWeekView = ({ date, firstWeek, events, onHandleDayClick }) => {
  return (
    <Grid
      item
      container
      alignItems="baseline"
      direction="row"
      justify="flex-start"
    >
      {Array.from(Array(7).keys()).map((element, index) => {
        const nextMonth =
          moment(date).month() < moment(date).add("day", element).month();
        const dailyEvents = events.filter((e) =>
          moment(e.date.start).isSame(moment(date).add("day", element), "day")
        );
        return (
          <CalendarDayView
            date={moment(date).add("day", element)}
            events={dailyEvents}
            firstWeek={firstWeek}
            nextMonth={nextMonth}
            onHandleDayClick={onHandleDayClick}
          ></CalendarDayView>
        );
      })}
    </Grid>
  );
};

export default CalendarWeekView;
```

## Monthly View Component

By using week based view, our monthly component will be alot shorter and easy. Again, we will add 5 week components on a grid. This component will take a month, events and eventhandlers as props. *month* is obvious, events are the meeting and notes on our calendar. We can take them from a REST API or somewhere else. Since this is a component example, i will not dig backend options. I will explain eventhandlers later. 

```javascript
const CalendarMonthView = ({ month, events, eventHandlers }) => {
  
  let firstDayOfMonth = moment().month(month).startOf("month");
  let weekDay = firstDayOfMonth.isoWeekday();
  let startOfCalendar = moment(firstDayOfMonth).add("day", weekDay - 7);
  
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(firstDayOfMonth);
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  const handleClick = (date, event) => {
    setSelectedDate(date);
    setSelectedEvent(event);

    setOpen(true);
  };
  return (
    <>
      <AddEventDialog
        state={open}
        setOpen={setOpen}
        date={selectedDate.format("YYYY-MM-DD")}
        dateAvailable={false}
        event={selectedEvent}
        eventHandlers={eventHandlers}
      ></AddEventDialog>
      <Grid container alignContent="stretch" justify="flex-start" alignItems>
        {Array.from(Array(5).keys()).map((element, index) => {
          return (
            <CalendarWeekView
              date={moment(startOfCalendar).add("week", element)}
              firstWeek={!element}
              events={events}
              onHandleDayClick={handleClick}
            ></CalendarWeekView>
          );
        })}
      </Grid>
    </>
  );
};

export default CalendarMonthView;
```

Now, we have calendar view.
![](../images/calendar_view.jpg)


## Adding note or meetings

I assumed two type of events, meeting or reminder. Adding note or a meeting will have 2 modes, if user clicks a currently added event, form will contain this information. If user clicks an empty day, form will be empty. This duality resulted a long component code. Sorry, you can decouple codes for empty dialog, filled dialog view.

Here you see eventhandlers again, they are a set of functions from upper covering component. However, you can use again a REST API endpoint for this operation. I try to encapsulate everyting inside the component. 

```javascript
const AddEventDialog = ({
  state,
  setOpen,
  date,
  dateAvailable,
  event,
  eventHandlers,
}) => {
  const [meeting, setMeeting] = React.useState(true);
  const [note, setNote] = React.useState("note");
  const [title, setTitle] = React.useState("title");
  const [dateStart, setDateStart] = React.useState("07:30");
  const [dateEnd, setDateEnd] = React.useState("07:30");

  const handleClose = () => {
    setTitle("");
    setNote("");
    setDateStart("07:30");
    setDateEnd("07:30");
    setOpen(false);
  };

  const handleEntering = () => {
    setMeeting(event && event.type ? event.type : "meeting");
    setTitle(event && event.title ? event.title : " ");
    setNote(event && event.note ? event.note : " ");
    setDateStart(event ? moment(event.date.start).format("HH:mm") : "07:30");
    setDateEnd(event ? moment(event.date.end).format("HH:mm") : "07:30");
  };

  const handleNote = (event) => {
    setNote(event.target.value);
  };

  const handleStartHour = (event) => {
    setDateStart(event.target.value);
  };

  const handleEndHour = (event) => {
    setDateEnd(event.target.value);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleDelete = () => {
    if (event) {
      eventHandlers.delete(event);
    }
    setOpen(false);
  };
  const handleSave = () => {
    let newEvent = {
      title: title,
      note: note,
      date: {
        start: moment(date)
          .add(parseInt(dateStart.split(":")[0]), "hour")
          .add(parseInt(dateStart.split(":")[1]), "minute")
          .toISOString(),
        end: moment(date)
          .add(parseInt(dateEnd.split(":")[0]), "hour")
          .add(parseInt(dateEnd.split(":")[1]), "minute")
          .toISOString(),
      },
      type: meeting == "meeting" ? "meeting" : "note",
    };

    console.log(newEvent);
    if (event) {
      console.log("update event");
      newEvent.id = event.id;
      eventHandlers.update(newEvent);
    } else {
      console.log("save event");
      eventHandlers.save(newEvent);
    }
    setOpen(false);
  };
  return (
    <Dialog
      id="Add-Event"
      open={state}
      onOpen
      onClose={handleClose}
      onEntering={handleEntering}
      maxWidth="xs"
      fullWidth
      scroll="paper"
      aria-labelledby="form-dialog-title"
    >
      <DialogContent style={{ minHeight: "400px", minWidth: "300px" }}>
        <Grid container direction="column" spacing={4}>
          <Grid item xs>
            <TextField
              id="standard-basic"
              label="Add Title"
              fullWidth
              value={title}
              onChange={handleTitle}
            />
          </Grid>
          <Grid item xs>
            <TextField
              id="standard-basic"
              variant="outlined"
              label="Note"
              rows={25}
              fullWidth
              value={note}
              onChange={handleNote}
            ></TextField>
          </Grid>
          <Grid item xs>
            <ButtonGroup color="primary">
              <Button
                variant={
                  (event ? event.type == "meeting" : meeting)
                    ? "contained"
                    : "outlined"
                }
                onClick={() => setMeeting(true)}
              >
                Meeting
              </Button>
              <Button
                variant={
                  (event ? event.type == "note" : !meeting)
                    ? "contained"
                    : "outlined"
                }
                onClick={() => setMeeting(false)}
              >
                Note
              </Button>
            </ButtonGroup>
          </Grid>

          <Grid item xs>
            {dateAvailable ? (
              <TextField
                id="date"
                label="Day"
                type="date"
                defaultValue={date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <TextField
                id="date"
                label="Day"
                type="date"
                disabled
                defaultValue={date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </Grid>

          <Grid item container xs spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="time"
                label="Start Date"
                variant="outlined"
                type="time"
                fullWidth
                defaultValue="07:30"
                onChange={handleStartHour}
                value={dateStart}
                // defaultValue="07:30"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="time"
                label="End Date"
                variant="outlined"
                type="time"
                fullWidth
                defaultValue="07:30"
                value={dateEnd}
                onChange={handleEndHour}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {event ? (
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        ) : null}
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEventDialog;
```
Here is the photo of add event dialog.

![](../images/add_event_dialog.jpg)


## Covering layout

We need to add navigation buttons to our calendar. 2 buttons for previous or next month is required for our user to search calendar. A view of current month information is also required.

Our cover will use monthly compnent and update dates with 2 buttons for monthly view.

```javascript

const Cover = ({ events }) => {
  const [date, setDate] = React.useState(moment().toISOString());
  const [month, setMonth] = React.useState(moment().month());
  const [eventList, setEventList] = React.useState(events);

  const onSaveEvent = (event) => {
    event.id = uuidv4();
    eventList.push(event);
    setEventList(eventList);
  };
  const onUpdateEvent = (event) => {
    let eventIndex = eventList.findIndex((e) => e.id == event.id);
    eventList[eventIndex] = event;
    setEventList(eventList);
  };
  const onDeleteEvent = (event) => {
    let eventIndex = eventList.findIndex((e) => e.id == event.id);
    eventList.splice(eventIndex, 1);
    setEventList(eventList);
  };
  const eventHandler = {
    save: onSaveEvent,
    update: onUpdateEvent,
    delete: onDeleteEvent,
  };
  const handlePrev = () => {
    setMonth(month - 1);
    setDate(moment(date).add(-1, "month"));
  };
  const handleNext = () => {
    setMonth(month + 1);
    setDate(moment(date).add(1, "month"));
  };
  return (
    <Container maxWidth="lg">
      <Grid
        item
        container
        alignItems="baseline"
        direction="column"
        justify="flex-start"
      >
        <Grid
          item
          xs
          container
          alignItems="baseline"
          direction="row"
          alignContent="space-between"
          style={{ border: "1px solid #dadce0", marginBottom: "10px" }}
          spacing={1}
        >
          <Grid item xs={1}>
            <Button color="primary" variant="contained" onClick={handlePrev}>
              {" "}
              {"< prev"}{" "}
            </Button>{" "}
          </Grid>

          <Grid item xs={1}>
            <Button color="primary" variant="contained" onClick={handleNext}>
              {" "}
              {"next >"}{" "}
            </Button>{" "}
          </Grid>

          <Grid item xs={4} style={{ marginLeft: "20px" }}>
            <Typography>{moment(date).format("MMMM,       YYYY")}</Typography>
          </Grid>
        </Grid>
        <Grid item xs>
          <CalendarMonthView
            month={month}
            events={eventList}
            eventHandlers={eventHandler}
          ></CalendarMonthView>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cover;

```

Critical issue here in this code is *eventhandlers* part. This is an object containing required functions. All data management will be controlled by this components.

```javascript
  const onSaveEvent = (event) => {
    event.id = uuidv4();
    eventList.push(event);
    setEventList(eventList);
  };
  const onUpdateEvent = (event) => {
    let eventIndex = eventList.findIndex((e) => e.id == event.id);
    eventList[eventIndex] = event;
    setEventList(eventList);
  };
  const onDeleteEvent = (event) => {
    let eventIndex = eventList.findIndex((e) => e.id == event.id);
    eventList.splice(eventIndex, 1);
    setEventList(eventList);
  };
  const eventHandler = {
    save: onSaveEvent,
    update: onUpdateEvent,
    delete: onDeleteEvent,
  };
```

## Finalizing Component

In the end, here is the app code. Every event has UUID based id, for deleting and updating issues.

```javascript
const events = [
  {
    id: "b6dd8a32-e899-4ee7-ac2f-0d579d527c40",
    avatar: "A",
    title: "meeting for virtual tour",
    type: "meeting",
    note: "a meeting",
    date: {
      start: "2020-04-08T04:13:56+03:00",
      end: "2020-04-08T12:13:56+03:00",
    },
  },
  {
    id: "31b03555-6152-4b17-b81f-667b8c3838f0",
    avatar: "B",
    title: "Pay rent for current month",
    type: "note",
    note: "a reminder",
    date: {
      start: "2020-04-27T10:13:56+03:00",
      end: "2020-04-27T15:13:56+03:00",
    },
  },
  {
    id: "1f374474-c093-4451-accc-d5e0bebb3ad3",
    avatar: "B",
    title: "22 2 ",
    type: "note",
    note: "a reminder",
    date: {
      start: "2020-04-27T16:13:56+03:00",
      end: "2020-04-27T17:13:56+03:00",
    },
  },
];

function App() {
  return (
    <div className="App">
      <Container maxWidth="lg">
        <Cover events={events}></Cover>
      </Container>
    </div>
  );
}

export default App;

```

Here is the final view of our calendar component.
![](../images/react_calendar_final.jpg)


You can find all the codes on my github repo.[react calendar component](https://github.com/osmanp/examples/tree/master/Calendar%20with%20React%20and%20MaterialUI)