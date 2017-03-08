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
  	//render calendar
  	calendarView.render();

    return mapView;
  },
  initZoom: (x,y) => {
  	var mapView = this.init();
  	mapView.zoomToLocation(x, y);
  }
});

module.exports = mainRouter;
