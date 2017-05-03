app.Router.Map = Backbone.Router.extend({
    routes: {
	'':'runMap'
    },
    runMap: function(){
	console.log("Map router run map");
	var mapView = app.getViewByName('MapView');
	var mapCollection = app.getCollection('MapCollection');
	
	mapCollection.onDataLoaded = function(){
	    mapView.renderDataPoints( this.toJSON() );
	}
	mapView.renderMap();
	mapCollection.getMapData();
	console.log(mapView);
    }
});
