app.Router.AdminRouter = Backbone.Router.extend({
    routes:{
	"": "tableRoute"
    },
    tableRoute: function(){
	
	console.log("Admin router routing default route");
	
	console.log( Handlebars );
	var eventAddView = app.getViewByName('EventAdd');
	var eventTableView = app.getViewByName('EventTable');
	var eventCollection = app.getCollection('EventCollection');

	eventAddView.validateLocation = function( values ){
	    eventCollection.newLocation( values );
	}
	eventCollection.validationSuccess = function( data ){
	    console.log("Validation was a success");
	    console.log( eventCollection.cache, data );
	    var cache = eventCollection.cache;
	    eventCollection.add({
		description:cache.description,
		enddate: cache.endDate,
		startdate: cache.startDate,
		name: cache.title,
		lat: data.lat,
		lon: data.lon
	
	    });
	    var viewData = [];
	    for( i in this.models )
		viewData.push( this.models[i].toJSON() );
	    eventTableView.render( viewData );
	    eventAddView.hideModal();
	};

	eventCollection.onDataLoaded = function(){
	    console.log("Data load success");
	    var viewData = [];
	    for( i in this.models )
		viewData.push( this.models[i].toJSON() );
	    eventTableView.render( viewData );
	};
	eventCollection.onDataError = function(){
	    console.log("Data load error" );
	};
	eventCollection.validationFailure = function( err ){
	    console.log("Form validation error: ", err );
	    eventAddView.modalError( err );
	}
    
       eventCollection.getUserData();
	//Initialize MVC
   },
});
