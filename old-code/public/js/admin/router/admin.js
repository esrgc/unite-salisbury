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

	//Router functions for views
	eventTableView.saveCollection = function(){
	    eventCollection.saveData();
	}
	eventTableView.addEvent = function(){
	    eventAddView.addItem();
	}
	eventTableView.removeById = function( eventId ){
	    eventCollection.removeById( eventId );
	}
	eventTableView.editById = function( id ){
	    
	    var model = eventCollection.getModelById( id );
	    console.log("Got model");
	    eventAddView.editItem( model );
	}
	eventAddView.validateInfo = function( model ){
	    console.log("Validate info", model);
	    eventCollection.enterEvent( model );
	    
	    
	}

	//Router functions for collection
	eventCollection.validationDone = function( err ){
	    console.log("Router validation done");
	    if( err )
		eventAddView.modalError( err );
	    else{
		var viewData = [];
		for( i in this.models )
		    viewData.push( this.models[i].toJSON() );
		eventTableView.render( viewData );
		eventAddView.hideModal();
	    }
	};

	eventCollection.onDataLoaded = function(){
	    console.log("Data load success");
	    var viewData = [];
	    var max = 0;
	    if( this.models.length > 0 )
		this.userId = this.models[0].get('ownerid');
	    for( i in this.models ){
		viewData.push( this.models[i].toJSON() );
		var eId = this.models[i].get('eventid');
			if( eId > max)
		   max = eId;
	    }
	    this.topId = max;
	   console.log("Owner id ", this.userId," top id", this.topId );
	   eventTableView.render( viewData );
	};
	eventCollection.onDataError = function(){
	    console.log("Data load error" );
	};
	eventCollection.validationFailure = function( err ){
	    console.log("Form validation error: ", err );

	}
    
       eventCollection.getUserData();
	//Initialize MVC
   },
});
