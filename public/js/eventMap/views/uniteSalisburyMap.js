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
