//To hold our event models as they are created
app.Collection.EventCollection = Backbone.Collection.extend({
    name: "EventCollection",
    initialize: function(){
	console.log("New event collection created");
    },
    newLocation: function( values ){
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
	console.log("Got response callback" , response );
	if( typeof this.validationSuccess == 'function' )
	    this.validationSuccess();
    }
	
	
});
