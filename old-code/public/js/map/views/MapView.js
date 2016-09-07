app.View.MapView = Backbone.View.extend({
  name: 'MapView',
  el: '#mapArea',
  map: null,
  points: [],
  renderMap: function() {
    console.log("Rendering map");
    this.map = L.map(this.el).setView([38.3607, -75.5994], 11);
    L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    }).addTo(this.map);
  },
  renderDataPoints: function(data) {
    console.log("Rendering data", data);
    var source = $('#popupTemplate').html();
    var template = Handlebars.compile(source);
    for (i in data) {
      var d = data[i];
      var tmpMarker = L.marker([d.lat, d.lon])
        .bindPopup(template(data[i]));

      tmpMarker.addTo(this.map);
    }

  }

});
