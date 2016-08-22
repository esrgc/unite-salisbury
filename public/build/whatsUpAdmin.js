app.View.EventAdd = Backbone.View.extend({
    name: 'EventAdd',
    el: '#addModal',
    templateEl: '#eventForm',
    events:{
	'click #validateEvent' : 'validateEvent'
    },
    addItem: function(){
	var modal = $(this.el);
	var template = Handlebars.compile(  $(this.templateEl).html() );
	var html = template( item.toJSON() );
	var content = modal.find('.modal-body');
	content.html( html );
	modal.modal('show');


    },
    validateEvent: function(){
	var form = $('#eventAddForm :input');
	var values = {};
	form.each( function(){
	    values[this.name] = $(this).val();
	});
	console.log( values );
	var newEvent = new app.Model.EventModel( values );
	console.log(" New event ", newEvent );
	//if( typeof this.validateLocation == 'function' )
	  //  this.validateLocation( values );
    },
    //
    editItem: function ( item ){
	var modal = $(this.el);
	var template = Handlebars.compile(  $(this.templateEl).html() );
	var html = template( item.toJSON() );
	var content = modal.find('.modal-body');
	content.html( html );
	modal.modal('show');
    },
    //hide and reset modal
    hideModal: function(){
	console.log("hiding modal");
	$(this.el).modal('hide');
	$("#eventAddForm")[0].reset();
	$("#modalErr").html('');
    },
    //Set error message on modal
    modalError: function( err ){
	console.log("Error modal");
	$("#modalErr").html("&nbsp"+ err );
    }
});

app.View.EventTable = Backbone.View.extend({
    name: 'EventTable',
    el: '#tableViewArea',
    events:{
	'click #saveButton': 'saveData',
	'click .table-remove': 'remove',
	'click .edit-row': 'edit',
	'click #addItem':'addItem'
    },
    //Render event table based on user data records
   render: function( data ){
	var source = $('#tableTemplate').html();
	var template = Handlebars.compile( source );
	var html = template( data );
	console.log( html );
	$( "#tableArea" ).html( html );
    },
    //Add a new event item
    addItem: function(){
	if( typeof this.addEvent == 'function' )
	    this.addEvent();
    },
    //Save the client data to server
    saveData: function(){
	if( typeof this.saveCollection == 'function' )
	    this.saveCollection();
    },
    //remove a row and its corresponding data model
    remove: function( e ){
	$(e.target).parents('tr').detach();
	if( typeof this.removeById == 'function' )
	    this.removeById( $(e.target).attr('value')  );
    },
    //Edit an existing row and its corresponding data model
    edit: function( e ){
	var rowVal = $(e.target).attr('value');
	if( typeof this.editById == 'function' )
	    this.editById( rowVal );
    }
});



app.Model.EventModel = Backbone.Model.extend({
    eventid: null,
    ownerid: null,
    title: null,
    description: null,
    lat: null,
    lon: null,
    street: null,
    city: null,
    startdate: null,
    starttime: null,
    enddate: null,
    endtime: null,
    
    initialize: function( attr ){
	console.log("New event created with attr", attr);
    },
    //Begin validation process
    validate: function(){
	if( this.validateDates() )
	    this.validateLocation();
    },
    //validate date data
    validateDates: function(){
	var startdate = values.startdate;
	var enddate = values.enddate;
	var starttime = values.starttime;
	var endtime = values.endtime;
	console.log( "Values ",values );
	console.log( "Dates ",startdate, enddate, starttime, values.endtime );
	if( !this.checkDate( startdate ) || !this.checkDate( enddate ) )
	    return "Dates not formatted correctly";
	if( !this.checkTime( starttime ) || !this.checkTime( endtime ) )
	    return "Times not formatted correctly";
	return true;
    },
    //Validate calendar dates
    checkDate: function( dateIn ){
	var reDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
	if( !dateIn.match( reDate ) )
	    return false;
	return true;
    },
    //Validate times
    checkTime: function( timeIn ){
	var reTime = /^\d{1,2}:\d{2}([ap]m)?$/;
	if( !timeIn.match( reTime ) )
	    return false;
	return true;
    },
    //Validate location for USA
    validateLocation: function(){
	var req = new XMLHttpRequest();
	var scope = this;
	var qString = 'http://nominatim.openstreetmap.org/search/q='
	              + this.street +
	             ',' + this.city +
	              '?format=json';
 
	req.addEventListener("load", this.geocodingListener );
	//A little trickery with scope here, the geocoding listener is
	// a method of the req object, but we need it to make a callback to
	//the model (this file) object. So we will attach a new middleman method to req
	//below that points to the real validation callback in the model
	//obj
	req.collectionCallback = function( response ){
	    scope.validationCallback( response );
	}
	req.open('GET', qString );
	req.send();
        console.log("Verification request sent");	
    },
    geocodingListener: function(){
	console.log(this.responseText);
	this.collectionCallback( this.responseText );
    },
    validationCallback: function( response ){
	var data = JSON.parse( response ); 
    }
	
});

//To hold our event models as they are created
app.Collection.EventCollection = Backbone.Collection.extend({
    name: "EventCollection",
    url: 'getUserEvents',
    cache: null,
    model: app.Model.EventModel,
    topId: 0,
    userId: 0,
    initialize: function(){
	console.log("New event collection created");
    },
    getUserData: function(){
	var scope = this;
	this.fetch({
	    success: function(c, r, o){
		scope.userId = o.xhr.getResponseHeader('id');
		if( typeof scope.onDataLoaded == 'function' )
		    scope.onDataLoaded();
		else
		    console.error("No handle for data load");
	    },
	    error: function(){
		if( typeof scope.onDataError == 'function' )
		    scope.onDataError();
		else
		    console.error("No handle for data error");
	    }
	});
    },
    addNewModel: function( model ){
	console.log( model.validate() );	    
    },
    saveData: function(){
	console.log("Collection saving data");
	this.sync( 'create', this );
    },
    newLocation: function( values ){
	this.cache = values;
	var datesResult = this.validateDate( values ) 
	
	if( datesResult == true )
	    this.validateLocation( values );
        else
            if( typeof this.validationFailure == 'function' )
		this.validationFailure( datesResult );
    },
    removeById: function( eventid ){
	console.log("Removing event id", eventid );
	this.remove( this.where( { eventid: Number(eventid) } ) ); 
    },
    getModelById: function( id ){
	console.log( this.models );
	console.log(" finding ", id );
	return this.findWhere( { "eventid": Number(id) } );
    }
    
});

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
	eventAddView.validateLocation = function( values ){
	    eventCollection.newLocation( values );
	}

	//Router functions for collection
	eventCollection.validationSuccess = function( data ){
	    console.log("Validation was a success");
	    console.log( eventCollection.cache, data );
	    var cache = eventCollection.cache;
	    this.topId=this.topId+1;
	    eventCollection.add({
		description:cache.description,
		enddate: cache.enddate,
		startdate: cache.startdate,
		starttime: cache.starttime,
		endtime: cache.endtime,
		name: cache.title,
		lat: data.lat,
		lon: data.lon,
		street: cache.street,
		city: cache.city,
		ownerid: this.userId,
		eventid: this.topId
	    
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
	    eventAddView.modalError( err );
	}
    
       eventCollection.getUserData();
	//Initialize MVC
   },
});

function startApp(){
    app.application({
	name:"WhatsUpAdmin",
	views: ['EventTable','EventAdd'],
	collections : ['EventCollection'],
	routers: ['AdminRouter']
    });

}










