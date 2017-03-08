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
    console.log('Initializing...');
    var scope = this;
      //render map
    scope._mapView.render();
    //wire event callback for calendar
    scope._calendarView.onEventsLoaded = (eventData, view) => {
      console.log(`this event is called from controller!`);
      console.log(eventData);
      let data = _.map(eventData, (value, index) => {
      	return {
      		x_coord: value.location.x,
      		y_coord: value.location.y,
      		title: value.title
      	};
      });

      scope._mapView.addClusterMarkers(data);

      /*TO BE WORKED ON*/
      //popup template needs to be dynamically passed in
    };

    scope._calendarView.onEventClick = (eventDataObj, jsEvent, view) => {
    	var location = eventDataObj.location;
    	if(typeof location == 'undefined')
    		return;
    	scope._mapView.zoomToLocation(location.x, location.y);
    };

    //render calendar
    scope._calendarView.render();
  }

  get mapView() {
    return this._mapView;
  }

  get calendarView() {
    return this._calendarView;
  }

  zoomToLocation(x, y) {
  	this._mapView.zoomToLocation(x, y);
  }
}

module.exports = mainController;
