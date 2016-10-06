app.Router.Map = Backbone.Router.extend({
  name: 'Map',
  routes: {
      '': 'runMap'
  },
  runMap: function(){
    console.log("Running map");
    var eventCollection = app.getCollection('EventCollection');
    var mapView = app.getView('MapView');
    
    eventCollection.onDataLoaded = function(){
        console.log( "Data is loaded" );
        mapView.loadEvents( this );
    }
    eventCollection.onDataCollectionError = function(){
        console.log( "Data is collected" );
    }

    eventCollection.fetchEvents();
    
  }
});
