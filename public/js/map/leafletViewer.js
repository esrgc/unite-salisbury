/*
Author: Tu hoang
ESRGC
Provides base (prototype) functions for mapviewer
Note: this class is defined using dx library

implements leaflet API 
operates foodshed application
*/
var Class = require('../util/class');
var MapViewer = require('./mapViewer');

var LeafletViewer = Class.define({
  name: 'LeafletViewer',
  extend: MapViewer,
  _className: 'LeafletViewer',
  initialize: function(options) {
    MapViewer.prototype.initialize.apply(this, arguments);
    //map setup
    var minimal = L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png');
    //var satellite = L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-0y6ifl91/{z}/{x}/{y}.png');

    var baseMaps = {
      "Base Map": minimal
        //"Satellite": satellite
    }
    this.features = new L.FeatureGroup([
      //new L.Marker([39.0, -76.70]).bindPopup('Some organization'),
      //new L.Marker([39.0, -76.20]).bindPopup('Abc company'),
      //new L.Marker([38.9, -76.0]).bindPopup('Eastern shore company'),
      //new L.Marker([38.36, -75.59]).bindPopup('Salisbury University')
    ]);
    this.geoJsonFeatures = L.geoJson();
    this.clusterGroup = new L.MarkerClusterGroup(this.clusterOptions);

    var overlayMaps = {
      //'State': stateBoundary,
      //'Counties': counties,
      'Overlays': this.geoJsonFeatures

    }
    this.map = L.map(this.el, {
      layers: [
        minimal,
        this.features,
        this.geoJsonFeatures,
        this.clusterGroup
      ],
      center: this.center || new L.LatLng(39.0, -76.70),
      zoom: this.zoomLevel || 7,
      scrollWheelZoom: this.scrollZoom || false
    });


    //copy layers to layer controls
    if (typeof this.baseLayers != 'undefined')
      for (var i in this.baseLayers) {
        var layer = this.baseLayers[i];
        if (layer !== undefined)
          baseMaps[i] = layer;
      }
    var overlayMaps = {
      //other overlay layers go here
      //feature layer
      //'Features': this.features,
      'Overlays': this.geoJsonFeatures
    };
    if (typeof this.overlays != 'undefined') {
      for (var i in this.overlays) {
        var layer = this.overlays[i];
        overlayMaps[i] = layer;
      }
    }
    //L.control.layers(baseMaps, overlayMaps).addTo(this.map);
    //L.control.scale().addTo(this.map);
  },
  getGeoJsonGroup: function() {
    return this.geoJsonFeatures;
  },
  getFeatureGroup: function() {
    return this.features;
  },
  addGeoJsonLayer: function(data, option) {
    if (typeof data == 'undefined') {
      console.log('No data found')
      return;
    }
    console.log('Adding data to map...');
    //console.log(data);
    if (this.geoJsonFeatures != 'undefined') {
      if (typeof option == 'undefined')
        this.geoJsonFeatures.addLayer(L.geoJson(data));
      else
        this.geoJsonFeatures.addLayer(L.geoJson(data, option));
    }
    console.log('------Data added to map');
  },
  clearGeoJsonFeatures: function() {
    if (this.geoJsonFeatures != 'undefined')
      this.geoJsonFeatures.clearLayers();
  },
  addFeatureToFeatureGroup: function(feature) {
    var features = this.features;
    if (typeof features == 'undefined') {
      console.log('No feature group found');
      return;
    }
    if (feature != null)
      features.addLayer(feature);
  },
  clearFeatures: function() {
    var features = this.features;
    if (typeof features == 'undefined') {
      console.log('No feature group found');
      return;
    }
    features.clearLayers();
  },
  createFeature: function(obj) {
    var wkt = new Wkt.Wkt();
    wkt.read(obj);
    var f = wkt.toObject();
    return f;
  },
  createMarker: function(lat, lng, options) {
    return L.marker(L.latLng(lat, lng), options);
  },
  addClusterMarker: function(marker) {
    if (typeof this.clusterGroup == 'undefined')
      return;
    this.clusterGroup.addLayer(marker);
  },
  clearClusterMarkers: function() {
    this.clusterGroup.clearLayers();
  },
  getClusterGroup: function(){
    return this.clusterGroup;
  },
  getFeaturesBound: function() {
    var features = this.features;
    if (typeof features == 'undefined') {
      console.log('No feature group found');
      return;
    }
    return features.getBounds();
  },
  getGeoJsonFeaturesBound: function() {
    var features = this.geoJsonFeatures;
    if (typeof features == 'undefined') {
      console.log('No geojson feature found');
      return;
    }
    return features.getBounds();
  },
  zoomToFeatures: function() {
    var bounds = this.getFeaturesBound();
    if (typeof bounds != 'undefined')
      this.map.fitBounds(bounds);
  },
  zoomToGeoJsonFeatures: function() {
    var bounds = this.getGeoJsonFeaturesBound();
    if (typeof bounds != 'undefined')
      this.map.fitBounds(bounds);
  },
  zoomToPoint: function(point, zoom) {
    var z = zoom || this.map.getMaxZoom(); //default zoom
    if (typeof point.x != 'undefined' && typeof point.y != 'undefined') {
      var latlng = new L.LatLng(point.y, point.x);
      this.map.setView(latlng, z);
    } else {
      this.map.setView(point, z);
    }
  },
  pointInPolygon: function(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0],
      y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0],
        yi = vs[i][1];
      var xj = vs[j][0],
        yj = vs[j][1];

      var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }

});

module.exports = LeafletViewer;