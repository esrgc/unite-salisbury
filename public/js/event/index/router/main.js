/*
Tu Hoang
*/

var MapView = require('../view/map.js');
var CalendarView = require('../view/calendar');

//views
var mapView = new MapView();
var calendarView = new CalendarView();


//router definition
var mainRouter = Backbone.Router.extend({
  name: 'EventIndex',
  routes: {
    '': 'init',
    ':x/:y': 'initZoom'
  },
  init: () => {
    console.log('Initializing...')
      //render map
    mapView.render();
    //wire event callback for calendar
    calendarView.onEventsLoaded = (eventData, view) => {
      console.log(`this event is called from router`);
      console.log(eventData);
    };
    //render calendar
    calendarView.render();


    // return mapView;
  },
  initZoom: (x, y) => {
    this.init();
    mapView.zoomToLocation(x, y);
  }
});

module.exports = mainRouter;
