app.Collection.MapCollection = Backbone.Collection.extend({
  name: 'MapCollection',
  url: 'getMapData',
  getMapData: function() {
    var scope = this;
    this.fetch({
      success: function() {
        if (typeof scope.onDataLoaded == 'function')
          scope.onDataLoaded();
        else
          console.error("Map Collection no handler");
      },
      error: function(err) {
        console.error(err)
      }
    });
  }

});
