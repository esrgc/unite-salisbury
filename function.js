var pg = require('pg');
var conString = require('./config/database').url;

module.exports = {
    getDataForUserId: function( id, cb ){
	var client = new pg.Client( conString );
	client.connect(function(){
	    client.query({
		text: 'SELECT * from data where ownerid = $1',
		values: [id]
	        }, function( err, result ){
		    if( err )
			cb( err, null );
		    else
			cb( null, result );
		    client.end();
		});
	});
    }
}
			 
	
	
	
