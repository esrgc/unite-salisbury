var LocalStrategy   = require('passport-local').Strategy;
var User = require('../user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        console.log(user.id +" was seralized");
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        console.log(id + "is deserialized");
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

   passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) { // callback with email and password from our form
	    console.log("Doing local logon", email," ", password);
            User.findOne( email , password, function( message, user) {
		console.log("Find one callback: ", user );
                if (!user)
                    return done(null, false, req.flash('loginMessage', message ) );
                else // all is well, return successful user
                    return done(null, user);
            });
	    
	}));
   passport.use('local-create', new LocalStrategy({
       usernameField : 'email',
       passwordField : 'password',
       passReqToCallback: true
  },
   function( req, email, password, done ){
       console.log("Got create req");
       console.log( req.body );
       if( req.body.access != 'john' )
	   return done( null, false, req.flash('createMessage', "Incorrect Access code") );
       else
	   User.createOne( email, password, function( message, user ){
	       console.log("User callback");
	       if( ! user )
		   return done( null, false, req.flash('createMessage', "There was an error creating your profile") );
		else{
		    console.log("Profile created");
		    return done( null, user );
		}
	   });	   
   }));
						     
}
