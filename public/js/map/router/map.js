app.Map = Backbone.Router.extend({
    routes: {
	'':'runMap'
    },
    runMap: function(){
	console.log("Map router run map");
    }
});
