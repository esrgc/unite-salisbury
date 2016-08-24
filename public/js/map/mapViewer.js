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

