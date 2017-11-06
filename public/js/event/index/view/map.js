/*
Author: Tu Hoang
ESRGC2017

View Map


Requires leaflet.js

Events 
onMapLoaded --fired when map is done initialized
onLayerChanged -- fired when new data is loaded to geojson
onGeomSelected -- fired when mouse clicked layer (geometry)
onFeatureMouseover -- fired when mouse is over a layer (geometry)
onFeatureMouseout -- fired when mouse is out of a layer (geometry)

setMapClickMode -- set selection mode (single or multi)
*/
var BaseMap = require('../../../shared/view/map.js');

var map = BaseMap.extend({
  name: 'unite-map',
  el: '.map',
  mapData: [

  ], //specified geojson layers (in sub views)
  render: function() {
    var scope = this;
    scope.makeMap(); //set up map
    scope.renderControls(); //render layer controls
    if (typeof scope.onMapLoaded == 'function') {
      scope.onMapLoaded();
    }
  }
});

module.exports = map;
