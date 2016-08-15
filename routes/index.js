var handlers = require('../function');
module.exports = function( app, passport ){
    //Get req
    app.get('/', function( req, res ){
	res.render('map/home.html');
    });
    
    app.get('/admin', function( req, res ){
	console.log(res);
	res.render('admin/index', {layout: 'adminLayout', message: req.flash('loginMessage') });
    });

    app.get('/table', function( req, res ){
	var data;
	console.log( handlers );
	handlers.getDataForUserId( req.user.rows[0].id, 
	   function( err, result ){
	       if( err )
		   console.log("Data fetch error", err );
	       else{
		   console.log("Got result", result.rows );
		   data = result.rows;
	       }
	       if( req.user ){
		   res.render('admin/table', {
		       user: req.user.rows[0].email,
		       data: data,
		       layout: 'adminLayout'
		   });
	       }
	       else
		   res.render('admin/index');
	   });
    });

    app.get('/create', function( req, res ){
	res.render('admin/create', {message: req.flash('createMessage') } );
    });

    //Post req
    app.post('/login', 
	passport.authenticate('local-login', {
	successRedirect: '/table',
	failureRedirect: '/admin',
	failureFlash: true })
    );
    app.post('/create',
	     passport.authenticate('local-create',{
		 successRedirect: '/table',
		 failureRedirect: '/create',
		 failureFlash: true })
    );
}
