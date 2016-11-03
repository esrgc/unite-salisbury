/*
Tu Hoang
ESRGC
2014

class.js
utility functions that implements OOP
*/

/*
function that defines a new class by passing a new
prototype object (literal) as parameter. New classes
can extend/inherit from other classes by passing the 
inherit class name to extend property of the new class 
prototype object

Example:
var newClass = dx.define({
extend: OtherClass,
initialize: function(options){
};
});
*/
var define = function(child) {
  var ch = child;
  var p = ch.extend;
  var _class_ = null;
  if (p == null || typeof p == 'undefined') {
    _class_ = function() {
      if (typeof this.initialize != 'undefined')
        this.initialize.apply(this, arguments);
    };
    _class_.prototype = ch;
  }
  else {
    _class_ = function() {
      var init = typeof this.initialize == 'function' ? this.initialize : 'undefined';
      //run child initialize function if exists
      if (typeof init == 'function') {
        init.apply(this, arguments);
      }
    };
    extend(_class_, p); //inherit prototype
    copy(_class_.prototype, ch); //augment prototype
  }
  return _class_;
};
/*
Deep copy object prototype by new keyword.
This method creates a new prototype object, whose prototype 
is a copy of the parent's prototype, and assign it to the child prototype.
Finally, sets the child's prototype constructor to the child's constructor
*/
var extend = function(child, parent) {
  var F = function() { };
  F.prototype = parent.prototype;
  child.prototype = new F();
  child.prototype.constructor = child;
  child.parent = parent.prototype;
};
//copy object properties
var copy = function(dest, source) {
  dest = dest || {};
  if (source) {
    for (var property in source) {
      var value = source[property];
      if (value !== undefined) {
        dest[property] = value;
      }
    }
    /**
    * IE doesn't include the toString property when iterating over an object's
    * properties with the for(property in object) syntax.  Explicitly check if
    * the source has its own toString property.
    */
    /*
    * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
    * prototype object" when calling hawOwnProperty if the source object
    * is an instance of window.Event.
    */

    var sourceIsEvt = typeof window.Event == "function"
                          && source instanceof window.Event;

    if (!sourceIsEvt &&
                source.hasOwnProperty && source.hasOwnProperty("toString")) {
      dest.toString = source.toString;
    }
  }
  return dest;
};
var parseDate = function(d) {
  var date = new Date(d);
  return date.toLocaleDateString()+" "+ date.toLocaleTimeString().replace(/:\d\d /,' ');
}

var parseTime = function(d){
  var time = new Date(d);
  return time.toLocaleTimeString();
}
var pad = function(str) {
  if (String(str).length == 1)
    return "0" + str;
  return str;
}


Handlebars.registerHelper('parseEvent', function(object) {
  var detail = object.detail;
  return new Handlebars.SafeString( 
    "<dt> Description: </dt>" +
    "<dd> " + detail.description + "</dd>" +
    "<dt> Start Date: </dt>" +
    "<dd> " + parseDate(detail.startDate) + "</dd>" +
    "<dt> End Date: </dt>" +
    "<dd> " + parseDate(detail.endDate) + "</dd>" +
    "<dt> Address: </dt>" +
    "<dd> " + detail.address + "</dd>" +
    "<dt> Date Created: </dt>" +
    "<dd> " + parseDate(object.date) + "</dd>" 
  );
});


/*
Author: Tu hoang
ESRGC
Provides base (prototype) functions for mapviewer
Note: this class is defined using dx library

implements leaflet API 
operates foodshed application
*/

app.Map.LeafletViewer = define({
  name: 'LeafletViewer',
  extend: app.Map.MapViewer,
  _className: 'LeafletViewer',
  initialize: function(options) {
    app.Map.MapViewer.prototype.initialize.apply(this, arguments);
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
      var latlng = new L.LatLng(point.x, point.y);
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

/*
Author: Tu hoang
ESRGC
Provides base (prototype) functions for mapviewer

This class implement leaflet API
*/


app.Map.MapViewer = define({
    name: 'MapViewer',
    _className: 'MapViewer',
    initialize: function(options) {
      copy(this, options);//copy all options to this class
    },
    zoomToExtent: function(extent) {
        this.map.fitBounds(new L.LatLngBounds(new L.LatLng(extent.xmin, extent.ymin),
         new L.LatLng(extent.xmax, extent.ymax)));
    },
    zoomToFullExtent: function() {
    },
    //zoom to xy (if level exists then zoom to that level otherwise maxlevel is used)
    zoomToXY: function(x, y, level) {
        if (typeof level == 'undefined')
            this.map.setView(new L.LatLng(y, x), this.map.getMaxZoom());
        else
            this.map.setView(new L.LatLng(y, x), level);
    },
    zoomIn: function() {
        this.map.zoomIn();
    },
    zoomOut: function() {
        this.map.zoomOut();
    },
    zoomToDataExtent: function(layer) {
        this.map.fitBounds(layer.getBounds());
    },
    panTo: function(x, y) {
        this.map.panTo(new L.LatLng(y, x));
    },
    locate: function() {
        this.map.locateAndSetView(this.map.getMaxZoom() - 2);
    }

});


/*
Tu Hoang
2015

Base collection
*/

app.Collection.BaseCollection = Backbone.Collection.extend({
  name: 'BaseCollection',
  socrataUrl: '',
  limit: 25000, //rows limit (this determines number of rows returned)
  
  getData: function() {
    return this.toJSON();
  },
  // template variables:
  // {{geom}}, {{geomName}}
  // if a variable is not provided, it will be ignored.
  queryCriterias: {

  },
  setCriterias: function(criterias) {
    copy(this.queryCriterias, criterias);
  },
  prepareQuery: function() {    
    //specify query templates
    //TO BE OVERRIDDEN IN SUBCLASS TO COMPILE QUERY WITH HANDLEBARS

    //FOR EXAMPLE
    // var select = [
    //   'date_trunc_y(date_paid) as year',
    //   '{{geom}}',
    //   'sum(total_project_claim_amount) as total',
    //   'sum(federal_co_payment) as federal',
    //   'sum(state_macs_payment) as state',
    //   'sum(farmer_amount) as farmer'
    // ].join(',');

    // var group = [
    //   'year',
    //   '{{geom}}'
    // ].join(',');

    // var where = [
    //   '{{#if geomName}}',
    //   "{{geom}} = '{{geomName}}'",
    //   '{{/if}}'
    // ].join('');

    // //template data
    // var criterias = this.queryCriterias;

    // //compile templates with data
    // this.query = {
    //   '$select': Handlebars.compile(select)(criterias),
    //   '$group': Handlebars.compile(group)(criterias),
    //   '$where': Handlebars.compile(where)(criterias)
    // };
  },
  //fetches data from socrata and parse returned data to 
  //make it ready for charts
  fetchData: function(criterias, cb) {
    var scope = this;
    scope.setCriterias(criterias);
    scope.prepareQuery(); //compile query templates and get query object
    this.fetch({
      reset: true, //fetch new data to replace existing models
      data: scope.query, //for query construction
      success: function(collection, response) {
        //console.log(collection.toJSON());

        //then invoke onDataLoaded event 
        if (typeof scope.onDataLoaded == 'function')
          scope.onDataLoaded.call(scope, scope);

        //call back invoked
        if (typeof cb == 'function')
          cb.call(this, this);
      },
      error: function(err) {
        console.log(err);
      }
    });
  }


});

/*
Author: Tu Hoang
ESRGC2015

View Map
base map view using backbone.js
element: '.map'
render basic map for dashboards

Requires leaflet.js

Events 
onMapLoaded --fired when map is done initialized
onLayerChanged -- fired when new data is loaded to geojson
onGeomSelected -- fired when mouse clicked layer (geometry)
onFeatureMouseover -- fired when mouse is over a layer (geometry)
onFeatureMouseout -- fired when mouse is out of a layer (geometry)

setMapClickMode -- set selection mode (single or multi)
*/

app.View.Map = Backbone.View.extend({
  name: 'base-map',
  el: '.map',
  type: 'map',
  mapControlsTemplate: '#map-control-tpl',
  mapData: [
    //defined in sub-classes
    // For example
    // {
    //   name: 'Region',
    //   type: 'layer',
    //   label: '',
    //   url: 'data/mdRegion.geojson',
    //   nameField: 'Regions',
    //   style: {
    //     fill: true,
    //     weight: 1,
    //     fillOpacity: 0.1,
    //     fillColor: '#2163B5',
    //     color: '#000'
    //   },
    //   selected: true
    // }
  ], //specified geojson layers (in sub views)
  mapDataLoaded: false,
  selectedLayer: 'County', //geometry type "County" or "Region"
  selectedFeature: null,
  selectedFeatureName: '',
  selectedLayers: [],
  singleSelect: false,
  mapParams: {
    areatype: '01',
    areacode: '0'
  },
  showMarkers: true,
  clusterMarkerCache: [],
  initialize: function() {
    //this.render();
  },
  render: function(options) {
    this.makeMap(); //set up map
    this.loadMapData(options); //load geometry       
    this.renderControls(); //render layer controls
    console.log(this.name + ' view has been rendered..')
  },
  makeMap: function() {
    this.mapViewer = new app.Map.LeafletViewer({
      el: this.el,
      center: new L.LatLng( 38.3607, -75.5994 ), //salisbury coordinates
      zoomLevel: 10,
      scrollZoom: true,
      clusterOptions: {
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 40,
        iconCreateFunction: function(cluster) {
          var childCount = cluster.getChildCount();
          var c = ' marker-cluster-';
          if (childCount <= 5) {
            c += 'small';
          } else if (childCount <= 10) {
            c += 'medium';
          } else {
            c += 'large';
          }

          return new L.DivIcon({
            html: '<div><span>' + childCount + '</span></div>',
            className: 'marker-cluster' + c,
            iconSize: new L.Point(40, 40)
          });
        }
      }
    });
  },
  loadMapData: function(options) {
    var scope = this;
    //use backbone model to load layer data
    var model = new Backbone.Model();
    var mapData = this.mapData;
    var counter = 0;
    var loadData = function(layer) {
      if (typeof layer == 'undefined'){
        if (typeof scope.onMapLoaded == 'function') {
          scope.onMapLoaded();
        }
        return;
      }
      if (layer.type == 'layer') {
        model.url = layer.url;
        model.fetch({
          success: function(data) {
            console.log('loaded map data for ' + layer.name);
            var newData = data.toJSON();
            layer.data = newData;
            //move to the next one
            counter++;
            if (counter < mapData.length) { //load more if exists
              loadData(mapData[counter]);
            } else {

              scope.mapDataLoaded = true;
              //show the state layer by default
              scope.showLayer(scope.selectedLayer, options);
              // scope.updateCharts(); //initially load charts data

              if (typeof scope.onMapLoaded == 'function') {
                scope.onMapLoaded();
              }
            }
          }
        });
      } else { //if data is not a layer skip to the next one
        counter++;
        if (counter < mapData.length) { //load more if exists
          this.loadData(mapData[counter]);
        } else {

          scope.mapDataLoaded = true;
          //show the state layer by default
          scope.showLayer(scope.selectedLayer, options);
          // scope.updateCharts(); //initially load charts data

          if (typeof scope.onMapLoaded == 'function') {
            scope.onMapLoaded();
          }
        }
      }
    };
    loadData(mapData[counter]);
  },
  //clear geometry and add the layer that is being requested to show
  showLayer: function(name, options) {
    console.log("showing  layer " + name);
    var scope = this;
    var setInitialAreaType = false;
    var layer = this.getLayer(name);
    if (typeof layer == 'undefined')
      return;
    scope.selectedLayer = name;
    scope.selectedFeatureName = '';
    scope.selectedFeature = null;
    scope.selectedLayers = [];
    var title = scope.getGeomName();
    scope.updateHoverText();
    var mapViewer = this.mapViewer;
    var newData = layer.data;
    var nameField = layer.nameField; //name of the property that contains geom name

    //determine layer styles (either a function returning style or a style object)
    var layerStyle = layer.style;
    var mouseoverStyle = {
      fillOpacity: 0.2
    };
    var selectedStyle = layer.selectedStyle || {
      //fillOpacity: 0.5
      //dashArray: '',
      opacity: 1,
      color: '#FCFF00',
      //color: '#E2E600',
      weight: 4
    };
    console.log(options); //custom styles passed in options --this will bypass default style and styled specified in layer data
    if (typeof options != 'undefined') {
      if (options.style)
        layerStyle = options.style; //using function or style object
      if (options.mouseoverStyle)
        mouseoverStyle = options.mouseoverStyle;
      if (options.selectedStyle)
        selectedStyle = options.selectedStyle;
    }


    mapViewer.clearGeoJsonFeatures(); //clear old features
    mapViewer.addGeoJsonLayer(newData, {
      style: layerStyle,
      //this call back handles mouse events on feature selection
      onEachFeature: function(feature, layer) {

        //set initial areatype once layer is loaded
        if (!setInitialAreaType) {
          setInitialAreaType = true;
          scope.mapParams.areatype = feature.properties.areatype;
        }
        //console.log(feature);
        layer.on('click', function(e) {
          //console.log(e.target);
          //clear style (selected)       
          var layerGroup = mapViewer.getGeoJsonGroup();
          //console.log(e.target);
          //reset style for the whole layer group
          _.each(layerGroup.getLayers(), function(layers) {
            _.each(layers.getLayers(), function(l) {
              layers.resetStyle(l);
            });
          });
          //process selected feature
          var l = e.target; //get selected feature
          var index = null;
          //check whether the layer is currently selected
          for (var i = 0; i < scope.selectedLayers.length; i++) {
            var layer = scope.selectedLayers[i];
            if (l.feature.properties.areacode == layer.feature.properties.areacode) {
              index = i;
            }
          }
          //simulate toggle selection
          if (index != null) {
            scope.selectedLayers.splice(index, 1); //remove current layer from selected
          } else {
            if (scope.singleSelect == true)
              scope.selectedLayers = []; //reset selected layers when single select mode is on
            // scope.selectedFeature = l;
            scope.selectedLayers.push(l); //add selected layer to the collection
          }

          //set the last selected layer
          if (scope.selectedLayers.length > 0) {
            var sl = scope.selectedLayers[scope.selectedLayers.length - 1];
            scope.selectedFeature = sl;
            scope.selectedFeatureName = sl.feature.properties.name ||
              sl.feature.properties.region ||
              sl.feature.properties[nameField] || ''; //store selected feature name                                     
          } else

            scope.selectedFeature = null;

          //map updates
          var areatype = null,
            areacodes = [],
            params;

          //re-hilight the selected features
          _.each(scope.selectedLayers, function(sl) {
            sl.setStyle(selectedStyle);
            var props = sl.feature.properties;
            //access properties to get area type and code            
            if (typeof props.areatype != 'undefined' && typeof props.areacode != 'undefined') {
              //get areatype
              if (areatype == null)
                areatype = props.areatype; //only set once

              //get area code
              areacodes.push(props.areacode);
            }
          });
          if (areacodes.length > 0)
            params = {
              areatype: areatype,
              areacode: areacodes.join(',')
            };
          else
            params = {
              areatype: areatype,
              areacode: '0'
            };
          //update charts
          // scope.updateCharts(params);
          scope.mapParams = params;

          //finally run geom selected call back 
          if (typeof scope.onGeomSelected == 'function') {
            scope.onGeomSelected.call(scope, feature, scope.selectedLayers); //pass selected feature as an argument
          }
        });
        layer.on('mouseover', function(e) {
          //set selected style
          var layer = e.target;
          layer.setStyle(mouseoverStyle);

          if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
          }

          //show text on the hover box
          var prop = e.target.feature.properties;
          var area = prop.name || prop.region || prop[nameField] || '';
          //settext
          scope.$('#hoverOverlay').text(area)

          if (typeof scope.onFeatureMouseover == 'function')
            scope.onFeatureMouseover(layer);
        });
        layer.on('mouseout', function(e) {
          var layerGroup = mapViewer.getGeoJsonGroup();
          //console.log(e.target);
          //reset style for current target
          _.each(layerGroup.getLayers(), function(l) {
            l.resetStyle(e.target);
          });

          //re-hilight the selected features
          _.each(scope.selectedLayers, function(l) {
            l.setStyle(selectedStyle);
          });
          //show text on the hover box
          scope.updateHoverText();
          if (typeof scope.onFeatureMouseout == 'function')
            scope.onFeatureMouseout(layer);
        });
      }
    });
  },
  getLayer: function(name) {
    for (var i in this.mapData) {
      var layer = this.mapData[i];

      if (layer.name == name)
        return layer;
    }
  },
  renderControls: function() {
    var scope = this;
    var data = this.mapData;
    // console.log(data);
    var template = Handlebars.compile($(this.mapControlsTemplate).html());
    var html = template({
      models: data
    });
    this.$('div.leaflet-bottom.leaflet-left').html(html);
    //wire layer controls events
    this.$('.overlays div.layers').on('click', function(e) {
      scope.mapControlClick.call(scope, e); //call callback in this view context
    });
    //hover box
    this.$('div.leaflet-top.leaflet-right').append(
      '<div id="hoverOverlay" class="layerToggle" style="display: block;"></div>'
    );
    //zoom to extent - insert the zoom to extent button to the 2 zoom in/out buttons
    this.$('div.leaflet-top.leaflet-left .leaflet-control-zoom-in').after([
      ' <a class="leaflet-control-zoom-out" id="zoomToExtent"',
      ' href="#" title="Zoom to Full-extent">',
      '<i class="fa fa-globe"></i>',
      '</a>'
    ].join(''));
    //zoom to extent button
    this.$('#zoomToExtent').on('click', function(e) {
      scope.mapViewer.zoomToGeoJsonFeatures(); //zoom to extent of current geojson layer
      return false;
    });
  },
  mapControlClick: function(e) {
    var c = e.currentTarget;
    var name = $(c).attr('data-name');
    console.log('map layer ' + name + ' control clicked');
    //show layer on the map
    this.showLayer(name);
    //add/remove check sign
    this.$(c).parent().find('i[role="checkbox"]').remove();
    $(c).find('p').append('<i class="fa fa-check" role="checkbox"></i>')
      // this.updateCharts(); //load defaults.
    if (typeof this.onLayerChanged == 'function')
      this.onLayerChanged.call(this, name);
  },
  getGeomName: function() {
    var title = '';
    if (this.selectedLayers.length > 1) {
      title = 'Multi Areas';
    } else if (this.selectedFeature == null)
      title = 'Statewide';
    else
      title = this.selectedLayer + ' ' + this.selectedFeatureName;
    return title;

    // switch (this.selectedLayer) {
    //   case 'State':
    //     title = 'Statewide'
    //     break;
    //   case 'County':
    //     if (this.selectedLayers.length > 1) {
    //       title = 'Multi counties';
    //       break;
    //     }
    //     if (this.selectedFeature == null)
    //       title = 'All counties';
    //     else
    //       title = 'County: ' + this.selectedFeatureName;
    //     break;
    //   case 'Region':
    //   case 'WIA':
    //     if (this.selectedLayers.length > 1) {
    //       title = 'Multi areas';
    //       break;
    //     }
    //     if (this.selectedFeature == null)
    //       title = 'All areas';
    //     else
    //       title = 'Area: ' + this.selectedFeatureName;
    //     break;
    //   case 'Zip':
    //     if (this.selectedFeature == null)
    //       title = 'All zips';
    //     else
    //       title = 'Zip: ' + this.selectedFeatureName;
    //     break;
    // }
    return title;
  },
  updateHoverText: function() {
    var title = this.getGeomName();
    //show text on the hover box
    this.$('#hoverOverlay').text(title);
  },
  getCurrentParams: function() {
    var scope = this,
      areatype = null,
      areacodes = [];

    _.each(scope.selectedLayers, function(sl) {
      var props = sl.feature.properties;
      //access properties to get area type and code            
      if (typeof props.areatype != 'undefined' && typeof props.areacode != 'undefined') {
        //get areatype
        if (areatype == null)
          areatype = props.areatype; //only set once

        //get area code
        areacodes.push(props.areacode);
      }
    });
    if (areacodes.length > 0)
      return {
        areatype: areatype,
        areacode: areacodes.join(',')
      };
    else
      return {
        areatype: areatype,
        areacode: '0'
      };
  },
  //select geometry by name
  selectGeom: function(featureNames, selectStyle) {
    var scope = this;
    var mapViewer = this.mapViewer;
    var geoJsonGrp = mapViewer.getGeoJsonGroup();

    var style = selectStyle || {
      fillOpacity: .5
    };

    _.each(featureNames, function(f) {
      //loop through featureNames to find the selected geom
      var feature = null;
      //console.log(geoJsonGrp);
      geoJsonGrp.getLayers()[0].eachLayer(function(layer) {
        feature = layer.feature;
        if (typeof feature != 'undefined') {
          //console.log(feature);
          if (feature.properties.name.toLowerCase() == f.toLowerCase()) {
            //found the feature, now select it
            layer.setStyle(style);
            //keep up with last selected feature
            scope.selectedFeature = layer;
            scope.selectedFeatureName = f;
            scope.selectedLayers.push(layer);
          }
        }
      });
      //show text on the hover box
      scope.updateHoverText();
      //select fetures with the attributes specified..to be implemented
      if (typeof this.onGeomSelected == 'function')
        this.onGeomSelected.call(this, feature);
    });
  },
  addClusterMarkers: function(data) {
    var mapViewer = this.mapViewer;
    mapViewer.clearClusterMarkers(); //clear current clustermakers
    if (typeof data == 'undefined')
      data = this.clusterMarkerCache;
    else
      this.clusterMarkerCache = data;

    if (data.length == 0) {
      console.log('Can not add cluster markers. Data is empty.');
      return;
    }
    //check switch value
    if (!this.showMarkers)
      return;


    //add new cluster markers
    _.each(data, function(d) {
      var m = mapViewer.createMarker(d.y_coord, d.x_coord, {});
      m.bindPopup([
        //to be filled out
      ].join(''), {});
      mapViewer.addClusterMarker(m);
    });

  },
  clearClusterMarkers: function() {
    var mapViewer = this.mapViewer;
    mapViewer.clearClusterMarkers(); //clear current clustermakers
  },
  setShowMarkers: function(value) {
    this.showMarkers = value;
    if (!value)
      this.clearClusterMarkers();
    else
      this.addClusterMarkers(); //passing no param to add the cached marker data
  },
  zoomToLocation: function(lat, lon) {
    this.mapViewer.zoomToPoint({
      x: lon,
      y: lat
    }, 14);
  },
  setMapClickMode: function(mode) {
    if (mode == 'single')
      this.singleSelect = true;
    else if (mode == 'multi')
      this.singleSelect = false;
    else {
      if (this.singleSelect)
        console.log('Map click mode is: Single selection');
      else
        console.log('Map click mode is: Multi selection')
    }
  }
});


var startup = function(){ 
  app.application({
    name: "WhatsUp-Map",
    views: [
      'UniteSalisburyMap'
    ],
    collections: [
      'EventCollection'
    ],
    routers: ['Map'],
    launch: function(){
      
    }
  });
}



app.Map.LeafletViewerForEvents = define({
  name: 'LeafletViewerWithEvents',
  extend: app.Map.LeafletViewer,
  _className: 'LeafletViewerWithEvents',
  initialize: function( options ){
    app.Map.LeafletViewer.prototype.initialize.apply( this, arguments );
    console.log( "Map view for events initialized" );
  },
  createMarker: function(lat, lng, options) {
    
    return L.marker(L.latLng(lat, lng), options);

  },
  addMarker: function( lat, lng, popup, options ){
      var marker = this.createMarker( lat, lng, options );
      marker.bindPopup( popup );
      marker.addTo( this.map );
  },
});

/*
Collection for events
*/


app.Collection.EventCollection = app.Collection.BaseCollection.extend({
  name: 'EventCollection',
  url: 'events',
  initialize: function() {}
 


});

app.Router.Map = Backbone.Router.extend({
  name: 'Map',
  routes: {
    '': 'init',
    ':x/:y': 'initZoom'
  },
  init: function(){
    //views
    var mapView = app.getView('UniteSalisburyMap');
    //collections
    var eventCollection = app.getCollection('EventCollection');
    //filters
    var filters = {

    };

    eventCollection.onDataLoaded = function(collection){
      var data = collection.getData();
      mapView.addClusterMarkers(data);
    };

    //render map and other components
    mapView.render();

    //load map data
    eventCollection.fetchData(filters);

  },
  initZoom: function( x, y ){
    console.log('Running with params', x+" "+y );
    var mapView = app.getView('MapView');
    //mapView.centerOn( x, y );

    this.init();
    mapView.zoomToLocation(y, x); //y is lat, x is long

  }

});

app.View.EventMap = Backbone.View.extend({
  name: "EventMap",
  el:'#mapArea',
  initialize: function(){
    this.makeMap();
  },
  makeMap: function(){  
    console.log("Rendering map");
    this.mapViewer = new app.Map.LeafletViewerForEvents({
      el: this.el,
      center: new L.LatLng( 38.3607, -75.5994 ),
      zoomLevel: 10,
      scrollZoom: true,
      clusterOptions: {
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 40,
        iconCreateFunction: function(cluster) {
          var childCount = cluster.getChildCount();
          var c = ' marker-cluster-';
          if (childCount <= 5) {
            c += 'small';
          } else if (childCount <= 10) {
            c += 'medium';
          } else {
            c += 'large';
          }

          return new L.DivIcon({
            html: '<div><span>' + childCount + '</span></div>',
            className: 'marker-cluster' + c,
            iconSize: new L.Point(40, 40)
          });
        }
      }
    });
  },
  loadEvents: function( collection ){
    console.log( "Unloading collection", collection.length );
    var i = 0, mapViewer = this.mapViewer;
    while( i < collection.length ){
      var event = collection.at( i );
      var location = event.get('location');
      console.log( location );
      //this.mapViewer.addMarker( location.y, location.x, this.renderPopupHTML( event ) ); 
      mapViewer.addClusterMarker(mapViewer.createMarker(location.y, location.x, {}));
      i++;
    }
  },
  renderPopupHTML: function( obj ){
    console.log( "Rendering HTML", obj.toJSON() );
    
    var source = $('#popupTemplate').html(); 
    var template = Handlebars.compile( source );
    return template( obj.toJSON() );


  },
  centerOn: function( x, y ){
    console.log( "x", x );
    this.mapViewer.zoomToPoint({x:y,y:x}, 14 );
  }


});

/*
Tu hoang
May 2016


map view for dashboard
*/

app.View.UniteSalisburyMap = app.View.Map.extend({
  name: 'UniteSalisburyMap',
  el: '.map#unite-map',
  selectedLayer: 'County',
  singleSelect: false,
  mapData: [
    // {
    //    name: 'Region',
    //    type: 'layer',
    //    label: '',
    //    url: 'data/mdRegion.geojson',
    //    nameField: 'Regions',
    //    style: {
    //      fill: true,
    //      weight: 1,
    //      fillOpacity: 0.1,
    //      fillColor: '#2163B5',
    //      color: '#000'
    //    },
    //    selected: true
    //  },
    // {
    //   name: 'County',
    //   type: 'layer',
    //   label: '',
    //   url: 'data/mdCounty.geojson',
    //   nameField: 'COUNTY',
    //   style: { //default style
    //     fill: true,
    //     weight: 1,
    //     fillOpacity: 0.1,
    //     fillColor: '#2163B5',
    //     color: '#000'
    //   },
    //   selectedStyle: {
    //     fillOpacity: .5,
    //     color: '#FB6D04',
    //     weight: 4
    //   },
    //   selected: true
    // }, {
    //   name: 'Watershed',
    //   type: 'layer',
    //   label: '',
    //   url: 'data/watershed.geojson',
    //   nameField: 'name',
    //   style: {
    //     fill: true,
    //     weight: 1,
    //     fillOpacity: 0.1,
    //     fillColor: '#2163B5',
    //     color: '#000'
    //   },
    //   selectedStyle: {
    //     fillOpacity: .5,
    //     color: '#FB6D04',
    //     weight: 4
    //   },
    //   selected: false
    // }, {
    //   name: 'Legislative',
    //   type: 'layer',
    //   label: '',
    //   url: 'data/mdLegislativeDistrict.geojson',
    //   nameField: 'name',
    //   style: {
    //     fill: true,
    //     weight: 1,
    //     fillOpacity: 0.1,
    //     fillColor: '#2163B5',
    //     color: '#000'
    //   },
    //   selectedStyle: {
    //     fillOpacity: .5,
    //     color: '#FB6D04',
    //     weight: 4
    //   },
    //   selected: false
    // }
  ],
  //custom render (overrides the base class render func)
  render: function() {
    var scope = this;
    scope.makeMap(); //set up map
    if (typeof scope.onMapLoaded == 'function') {
      scope.onMapLoaded();
    }
  },
  //override function in base class to pass in new popup template
  //To be rewritten to use template (handlebars)
  addClusterMarkers: function(data) {
    var mapViewer = this.mapViewer;
    mapViewer.clearClusterMarkers(); //clear current clustermakers
    if (typeof data == 'undefined')
      data = this.clusterMarkerCache;
    else
      this.clusterMarkerCache = data;

    if (data.length == 0) {
      console.log('Can not add cluster markers. Data is empty.');
      return;
    }
    //check switch value
    if (!this.showMarkers)
      return;

    //add new cluster markers    
    _.each(data, function(d) {
      var popupHtml = Handlebars.compile($('#popupTemplate').html())(d);

      var m = mapViewer.createMarker(d.location.y, d.location.x, {});
      m.bindPopup(popupHtml, {});
      mapViewer.addClusterMarker(m);
    });
  }
});
