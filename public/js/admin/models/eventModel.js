
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
    validate: function( cb ){
	if( this.validateDates() )
	    this.validateLocation( cb );
	else 
	    cb( "Dates not formatted correctly" );
	
    },
    //validate date data
    validateDates: function(){
	var startdate = this.get('startdate');
	var enddate = this.get('enddate');
	var starttime = this.get('starttime');
	var endtime = this.get('endtime');
	
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
    validateLocation: function( cb ){
	this.validationCB = cb;
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
	req.dataRecievedCallback = function( response ){
	    scope.validationCallback( response);
	}
	req.open('GET', qString );
	req.send();
    },
    geocodingListener: function(){
	this.dataRecievedCallback( this.responseText );
    },
    validationCallback: function( response){
	var data = JSON.parse( response );
	console.log( data );
	this.validationCB( "Got it");
	
    }
	
});
