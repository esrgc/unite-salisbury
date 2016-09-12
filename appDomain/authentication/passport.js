/*
Implement passport authentication
*/
var accessCode = require('../../config').accessCode;
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
  // by default, local strategy uses username and password, we will override with email
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
      if (err){
        console.log(err);
        return done(err);
      }
      // if no user is found, return the message
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

      // if the user is found but the password is wrong
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Invalid password.')); // create the loginMessage and save it to session as flashdata

      // all is well, log the user in
      req.logIn(user, function(err) {
        if (err) {
          return done(err);
        }
        console.log('Logging %s in..', user.email);
      });
      return done(null, user);
    });

  });

}));

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
//  if (req.body.access != accessCode)
//    return done(null, false, req.flash('createMessage', "Incorrect access code."));

  User.findOne({ email: email }, function(err, user) {
    if (err)
      return done(err);
    if (user)
      return done(null, false, req.flash('signupMessage', "That email is already taken."));
    else {
      var newUser = new User({ email: email });
      newUser.password = newUser.generateHash(password);
      newUser.save(function(err) { // save
        if (err)
          return done(err);
        else
          req.logIn(newUser, function(err) { //on save, login
            if (err)
              return done(err);
            return done(null, newUser);
          }); //End req.logIn
      }); //End newUser.save
    } //End else
  }); //End find one
}));




module.exports = passport;
