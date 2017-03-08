/*
Tu Hoang
*/

var MapView = require('../view/map.js');


var mainRouter = Backbone.Router.extend({
  name: 'EventIndex',
  routes: {
    '': 'init',
    ':x/:y': 'initZoom'
  },
  init: () => {
  	console.log('Initializing...')
  	var mapView = new MapView();
  	mapView.render();
    
  },
  initZoom: (x,y) => {

  }
});

module.exports = mainRouter;
