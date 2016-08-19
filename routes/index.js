//John Talbot
//Aug 2016
//Routes
var handlers = require('../function');
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
	res.render('admin/table', {
	       user: req.user.rows[0].email,
	 });
    });

    //Render user creation form
    app.get('/create', function( req, res ){
	res.render('admin/create', {message: req.flash('createMessage') } );
    });

    //GET url from admin event collection
    app.get('/getUserEvents', function( req, res ){
	console.log("Get data from collection", req.user.rows);
	handlers.getDataForUserId( req.user.rows[0].id, 
	   function( err, result ){
	       if( err )
		   console.log("Data fetch error", err );
	       else{
		   data = result.rows;
		   res.header('id', req.user.rows[0].id );
		   res.json(data);
	       }
	  });
    });
    //Get alll event data
    app.get('/getMapData', function( req, res ){
	console.log("Getting map data");
	handlers.getMapData(function(err, results ){
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
