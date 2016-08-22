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
