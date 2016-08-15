app.Router.AdminRouter = Backbone.Router.extend({
    routes:{
	"": "defaultRoute",
    },
    defaultRoute: function(){
	console.log("Admin router routing default route");
	var eventAddView = app.getViewByName('EventAdd');
	var eventTableView = app.getViewByName('EventTable');
	var eventCollection = app.getCollection('EventCollection');
	eventAddView.validateLocation = function( values ){
	    var success = eventCollection.newLocation( values );
	    console.log("Validation was a ", success );
	}
	eventCollection.validationSuccess = function(){
	    console.log("Validation was a success");
	}
	    
	
	//Initialize MVC
   },
});
