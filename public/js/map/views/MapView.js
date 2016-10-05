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
  }
});
