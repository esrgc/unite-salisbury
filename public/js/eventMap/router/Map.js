app.Router.Map = Backbone.Router.extend({
  name: 'Map',
  routes: {
    '': 'runMap',
    ':x/:y': 'runMapWithParams'
  },
  runMap: function(){
    console.log("Running map");
    console.log( Backbone.history.getFragment() );
    this.run();
  },
  runMapWithParams: function( x, y ){
    console.log('Running with params', x+" "+y );
    var mapView = app.getView('MapView');
    mapView.centerOn( x, y );
    this.run();

  },
  run: function(){
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
