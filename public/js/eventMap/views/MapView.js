app.View.MapView = Backbone.View.extend({
  name: "MapView",
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
      scrollZoom: true
    });
  },
  loadEvents: function( collection ){
    console.log( "Unloading collection", collection.length );
    var i = 0;
    while( i < collection.length ){
      var event = collection.at( i );
      var location = event.get('location');
      console.log( location );
      this.mapViewer.addMarker( location.y, location.x, this.renderPopupHTML( event ) ); 
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
    this.mapViewer.zoomToPoint({x:y,y:x}, 10 );
  }


});
