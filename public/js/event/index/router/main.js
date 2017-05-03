/*
Tu Hoang
March 2017

main router for event/index page
*/

// var MapView = require('../view/map.js');
// var CalendarView = require('../view/calendar');

// //views
// var mapView = new MapView();
// var calendarView = new CalendarView();

var MainController = require('../controller/main');
var controller = new MainController();

//router definition
var mainRouter = Backbone.Router.extend({
  name: 'EventIndex',
  routes: {
    '': 'init',
    ':x/:y': 'initZoom'
  },
  init: () => {
    //initialize components
    controller.initialize();

    //return controller;
  },
  initZoom: (x, y) => {
    this.init();
    controller.zoomToLocation(x, y);
  }
});

module.exports = mainRouter;
