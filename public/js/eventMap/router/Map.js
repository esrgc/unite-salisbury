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
    var mapView = app.getView('UniteSalisburyMap');
    //mapView.centerOn( x, y );

    this.init();
    mapView.zoomToLocation(x, y); //y is lat, x is long

  }

});
