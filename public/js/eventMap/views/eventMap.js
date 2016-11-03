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
