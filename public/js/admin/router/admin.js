app.Router.AdminRouter = Backbone.Router.extend({
    routes:{
	"": "tableRoute"
    },
    tableRoute: function(){
	
	console.log("Admin router routing default route");
	var eventAddView = app.getViewByName('EventAdd');
	var eventTableView = app.getViewByName('EventTable');
	var eventCollection = app.getCollection('EventCollection');
	eventAddView.validateLocation = function( values ){
	    var success = eventCollection.newLocation( values );
	    console.log("Validation was a ", success );
	}
	eventCollection.validationSuccess = function( data ){
	    console.log("Validation was a success");
	    eventTableView.addRow( data );
	}
	    
	
	//Initialize MVC
   },
});
