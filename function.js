var pg = require('pg');
var conString = require('./config/database').url;
var conJson = require('./config/database').json;


//Database functionality
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
    },
    updateByUserId: function( id, data, cb){
	var pool = new pg.Pool( conJson );
	var scope = this;
	var updateKey = Math.floor( ( Math.random() * 1000000 ) + 1 );
	pool.query( "DELETE FROM data WHERE ownerid = $1 AND updatekey != $2", 			           [id , updateKey], 
	    function(err) {
		console.log("Done purge");
		if( err ) 
		    cb("Purge error", err );
		else
		    cb( null );
	});
	for( var i =0; i < data.length; i++ ){
		item = data[i];
		pool.query({
			text:'INSERT INTO data VALUES( $1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11 )',
			values: [ item.name,
				  item.startdate+' '+ scope.check(item.starttime),
				  item.enddate+' '+ scope.check(item.endtime),
				  item.street,
				  item.city,
				  item.lat,
				  item.lon,
				  item.descrition,
				  item.eventid,
				  id,
				  updateKey ]
			},
		        function( err ){//query callback
			    console.log("WTF");
			    if( err )
				cb( err);
			    else
				cb( null );
			});//End Query
	 }//For loop

	
    },
    check: function( item ){
	if( item )
	    return item
	return "";
    }
			
    			

			    
			
}
			 
	
	
	
