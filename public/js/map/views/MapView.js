app.View.MapView = Backbone.View.extend({
  name: "MapView",
  el:'#mapArea',
  initialize: function(){
    console.log("Hello");
    this.makeMap();
  },
  makeMap: function(){  
    console.log("Rendering map");
    this.mapViewer = new app.Map.LeafletViewer({
      el: this.el,
      center: new L.LatLng( 38.3607, -75.5994 ),
      zoomLevel: 10,
    });
  },
  loadEvents: function( collection ){
    console.log( "Unloading collection", collection.length );
    var i = 0;
    while( i < collection.length ){
      var event = collection.at( i );
      var location = event.get('location');
      console.log( location );
      this.mapViewer.addMarker( location.y, location.x ); 
      i++;
    }
  }
});
