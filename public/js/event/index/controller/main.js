/*
Tu Hoang
March 2017

Controller class that handles map and calendar view 

ES6 rocks
*/
var MapView = require('../view/map.js');
var CalendarView = require('../view/calendar');


class mainController {
  constructor() {
    //views
    this._mapView = new MapView();
    this._calendarView = new CalendarView();
  }
  //initialize view components 
  initialize() {
    console.log('Initializing...')
      //render map
    this._mapView.render();
    //wire event callback for calendar
    this._calendarView.onEventsLoaded = (eventData, view) => {
      console.log(`this event is called from controller!`);
      console.log(eventData);
    };
    //render calendar
    this._calendarView.render();
  }

  get mapView() {
    return this._mapView;
  }

  get calendarView() {
    return this._calendarView;
  }
}

module.exports = mainController;
