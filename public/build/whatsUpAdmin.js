app.View.EventAdd = Backbone.View.extend({
    name: 'EventAdd',
    el: '#addModal',
    events:{
	'click #addItem' : 'addItem'
    },
    addItem: function(){

	//Get data from form and pass to router
	var form = $('#eventAddForm :input');
	var values = {};
	form.each( function(){
	    values[this.name] = $(this).val();
	});
	console.log( values );
	if( typeof this.validateLocation == 'function' )
	    this.validateLocation( values );



    },
    //hide and reset modal
    hideModal: function(){
	console.log("hiding modal");
	$(this.el).modal('hide');
	$("#eventAddForm")[0].reset();
	$("#modalErr").html('');
    },
    modalError: function( err ){
	console.log("Error modal");
	$("#modalErr").html("&nbsp"+ err );
    }
});

app.View.EventTable = Backbone.View.extend({
    name: 'EventTable',
    el: '#tableArea',
    addRow: function( data ){
	var tableArea = $(this.el);
	var newRow = tableArea.find('tr').clone(true);
	console.log( newRow );
	tableArea.find('table').append( newRow );
	console.log("adding row with data",data);
    },
    render: function( data ){

	console.log( "View render" , data );
	var source = $('#tableTemplate').html();
	var template = Handlebars.compile( source );
	var html = template( data );
	console.log( html );
	$( this.el ).html( html );
    }
});



app.Model.EventModel = Backbone.Model.extend({
    initialize: function(){
	console.log("New event created");
    }
});

//To hold our event models as they are created
app.Collection.EventCollection = Backbone.Collection.extend({
    name: "EventCollection",
    url: 'getUserEvents',
    cache: null,
    initialize: function(){
	console.log("New event collection created");
    },
    getUserData: function(){
	var scope = this;
	this.fetch({
	    success: function(){
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
	    
    newLocation: function( values ){
	this.cache = values;
	var datesResult = this.validateDate( values ) 
	
	if( datesResult == true )
	    this.validateLocation( values );
        else
            if( typeof this.validationFailure == 'function' )
		this.validationFailure( datesResult );
		
    },
    validateLocation: function( values ){
	var req = new XMLHttpRequest();
	var scope = this;
	var qString = 'http://nominatim.openstreetmap.org/search/q='
	              + values.street +
	             ',' + values.city +
	              '?format=json';
 
	req.addEventListener("load", this.nominatimListener );
	req.collectionCallback = function( response ){
	    scope.validationCallback( response );
	}
	req.open('GET', qString );
	req.send();
        console.log("Verification request sent");	
    },
    nominatimListener: function(){
	console.log(this.responseText);
	this.collectionCallback( this.responseText );
    },
    validationCallback: function( response ){
	var data = JSON.parse(response); 
	console.log("Got response callback" , data );
	if( typeof data[0] == 'undefined' || typeof data[0].lat == 'undefined' || typeof data[0].lon == 'undefined'){
	    if( typeof this.validationFailure == 'function' )
		this.validationFailure( "Could not lookup that address");
	}
	else
	    if( typeof this.validationSuccess == 'function' )
		this.validationSuccess({ lat: data[0].lat, lon:data[0].lon});
    },
    validateDate: function( values ){
	var startdate = values.startdate;
	var enddate = values.enddate;
	var starttime = values.starttime;
	var endtime = values.endtime;
	console.log( "Values",values );
	console.log( "dates ",startdate, enddate, starttime, values.endtime );
	if( !this.checkDate( startdate ) || !this.checkDate( enddate ) )
	    return "Dates not formatted correctly";
	if( !this.checkTime( starttime ) || !this.checkTime( endtime ) )
	    return "Times not formatted correctly";
	return true;
    },
    checkDate: function( dateIn ){
	var reDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
	if( !dateIn.match( reDate ) )
	    return false;
	return true;
    },
    checkTime: function( timeIn ){
	var reTime = /^\d{1,2}:\d{2}([ap]m)?$/;
	if( !timeIn.match( reTime ) )
	    return false;
	return true;
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

function startApp(){
    app.application({
	name:"WhatsUpAdmin",
	views: ['EventTable','EventAdd'],
	collections : ['EventCollection'],
	routers: ['AdminRouter']
    });

}

//for admin page




var $table = $('.adminTable');
var $saveButton = $('#saveButton');
var $tableArea = $('#tableArea');

$('.table-remove').click( function(){
    $(this).parents('tr').detach();
});


function listener(){
    console.log(this.responseText);
}


$saveButton.click( function(){
    var rows = $tableArea.find('tr:not(:hidden)');
    var data;
    for( var i =1; i < rows.length; i++ )
	console.log(rows[i]);
    var req = new XMLHttpRequest();
    req.addEventListener( "load", listener );
    req.collectionCallback = this;
    req.open( "GET", "http://nominatim.openstreetmap.org/search/q=705%20edgewater%20drive,%20salisbury?format=json");
    req.send();
});




