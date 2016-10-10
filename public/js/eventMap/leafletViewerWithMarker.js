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
