//To hold our event models as they are created
app.Collection.EventCollection = Backbone.Collection.extend({
    name: "EventCollection",
    url: 'getUserEvents',
    cache: null,
    topId: 0,
    userId: 0,
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
    },
    removeById: function( eventid ){
	console.log("Removing event id", eventid );
	this.remove( this.where( { eventid: Number(eventid) } ) ); 
    }
	
	
});
