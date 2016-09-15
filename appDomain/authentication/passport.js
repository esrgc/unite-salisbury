/*
Implement passport authentication
*/
// var accessCode = require('../../config').accessCode;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//user model
var User = require('../dataRepository').User;

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  // console.log("Serialize", user);
  done(null, user._id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // allows us to pass back the entire request to the callback
}, function(req, email, password, done) {
  console.log('authenticating....');
  // asynchronous
  // User.findOne wont fire unless data is sent back
  process.nextTick(function() {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'email': email }, function(err, user) {
      // console.log(user);
      // if there are any errors, return the error before anything else
      console.log("Finding user");//this is not finding user. At this step either already found or not found
      if (err) {
        console.log(err);
        return done(err);
      }
      // if no user is found, return the message
      if (!user){
        console.log("No user");
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
      }
      // if the user is found but the password is wrong
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Invalid password.')); // create the loginMessage and save it to session as flashdata
           
      return done(null, user);
    });

  });

}));

//moved to signup route..no need for passport here
// passport.use('local-signup', new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   passReqToCallback: true
// }, function(req, email, password, done) {
  
// }));




module.exports = passport;
