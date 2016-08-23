//John Talbot
//Aug 2016
//Routes
var handlers = require('../function');

var formatTime = function( t ){
    var hours = Number( t[0]+t[1] );
    var min = Number( t[3]+t[4] );
    var suffix = 'am';
    if( hours == 0 )
	hours = 12;
    else if( hours > 12 ){
	hours = hours - 12;
	suffix = 'pm';
    }
    return hours+':'+min+suffix;
}

var formatDates = function( d ){
    d.startdate = (d.startdate.getMonth()+1) +'/'+ (d.startdate.getDay()+1) + '/' + d.startdate.getFullYear();
    d.starttime = formatTime( d.starttime );
    d.enddate = (d.enddate.getMonth()+1) +'/'+ (d.enddate.getDay()+1) + '/' + d.enddate.getFullYear();
    d.endtime = formatTime( d.endtime );
}
    

module.exports = function( app, passport ){
//************GET Requests***********************************************
    //Render map app
    app.get('/', function( req, res ){
	res.render('map/home.html');
    });
    //Render admin login
    app.get('/admin', function( req, res ){
	console.log(res);
	res.render('admin/index', { message: req.flash('loginMessage') });
    });
    
    //Render user table and admin app (needs to be logged in)
    app.get('/table', function( req, res ){
	var data;
	if( typeof req.user == 'undefined' )
	    res.render( 'admin/index' );
	else
	    res.render( 'admin/table', {
		user: req.user.rows[0].email,
	});
    });

    //Render user creation form
    app.get( '/create', function( req, res ){
	res.render( 'admin/create', { message: req.flash( 'createMessage' ) } );
    });

    //GET url from admin event collection
    app.get('/getUserEvents', function( req, res ){
	handlers.getDataForUserId( req.user.rows[0].id, 
	   function( err, result ){
	       if( err )
		   console.log("Data fetch error", err );
	       else{
		   data = result.rows;
		   for( i in data )
		       formatDates( data[i] );
		   res.header('id', req.user.rows[0].id );
		   res.json(data);
	       }
	  });
    });
    //GET all event data
    app.get('/getMapData', function( req, res ){
	console.log("Getting map data");
	handlers.getMapData(function( err, results ){
	    res.json( results )
	});
    });


  //******POST Requests************************************************************ 
    //Login
   app.post('/login', 
	passport.authenticate('local-login', {
	successRedirect: '/table',
	failureRedirect: '/admin',
	failureFlash: true })
    );

    //Post creation data
    app.post('/create',
	     passport.authenticate('local-create',{
		 successRedirect: '/table',
		 failureRedirect: '/create',
		 failureFlash: true })
    );
    //Post from admin event collection
    app.post('/getUserEvents',function( req, res ){
	var fail = false;
	handlers.updateByUserId( req.user.rows[0].id, req.body, 
		 function( err, client ){
		     if( err ){
			 
		     }
	});
	res.end();
    });
}
