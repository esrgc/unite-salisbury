/*
authentication routes go here
*/

var express = require('express');
var router = express.Router();

var domain = require('../appDomain');
var User = domain.dataRepository.User;
var passport = domain.authentication.passport;

router.use(function(req, res, next) {
  res.locals.rootPath = '../';
  next();
});

/* sign in*/
router.get('/login', function(req, res) {
  var returnUrl = req.query.returnUrl || '';
  res.render('auth/login', {
    title: 'Please log in',
    message: req.flash('loginMessage'),
    returnUrl: returnUrl
  });
});

// router.post('/login', function(req, res){
//  res.send('OK');
// });
router.post('/login', passport.authenticate('local-login', {
  failureRedirect: 'login',
  failureFlash: true // allow flash messages
}), function(req, res) {
  // console.log("This mystery function is only invoked after successfully logged in");
  var user = req.user;
  var returnUrl = req.body.returnUrl || '';
  // all is well, log the user in
  req.logIn(user, function(err) {
    if (err) {
      return done(err);
    }
    console.log('Logging %s in..', user.email);
  });

  if (returnUrl === '')
    res.redirect('/');
  else
    res.redirect(returnUrl);
});

//logout
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('loginMessage', 'You have successfully logged out.')
  res.redirect('/');
});

/*sign up*/
router.get('/signup', function(req, res) {
  res.render('auth/signup', {
    title: 'Singup',
    message: req.flash('signupMessage'),
  });
});
//sign up post
router.post('/signup', function(req, res, next) {
  //create a new user
  var data = req.body;
  //bind post data to model instance (document)
  var newUser = new User({
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    role: 'user' //default
  });

  //done callback
  var done = function(err, user, validationError) {
    //if error render the sign up page again
    if (err) {
      res.render('auth/signup', {
        title: 'Singup',
        message: req.flash('signupMessage'),
        newUser: user, //user model that contains previous user data
        err: validationError //show all error messages
      });
    } else {
      //redirect to profile page (home page for  now)      
      res.redirect('/');
    }
  };

  //Now look for email existing
  User.findOne({ email: data.email }, function(err, user) {
    if (err) {
      //error occur
      req.flash('signupMessage', 'An error has occured while processing. Please try again!');
      return done(true, null);

    }
    if (user) {
      req.flash('signupMessage', "That email is already taken. Please try again!");
      return done(true, newUser);
    } else {
      //newUser.password = newUser.generateHash(password); Need to check password first! Hash after validate

      //check if password == confirmPass
      if (data.confirmPassword != data.password) {
        req.flash('signupMessage', "Confirmation password does not match. Please try again!");
        return done(true, newUser);
      }
      //now validate the model
      var validateErr = newUser.validateSync();
      //validation errors occur
      if (typeof validateErr != 'undefined') {
        console.log(validateErr);
        req.flash('signupMessage', "Data entered is invalid. Please try again!");
        return done(true, newUser, validateErr); //pass validation errors to re-display
      }

      //no validation error -> now hash the password
      newUser.password = newUser.generateHash(newUser.password);

      //everything is good now save the user
      newUser.save(function(err) { // save
        if (err) {
          req.flash('signupMessage', "Error saving data to the database. Please try again!");
          return done(true, newUser);
        } else
          req.logIn(newUser, function(err) { //on save, login
            // if (err){
            //   //req.flash('loginMessage', "Error logging in. Please try again!");
            //   done(true, newUser)
            // }
            //every thing worked so call done
            return done(false, newUser);
          }); //End req.logIn
      }); //End newUser.save
    } //End else


  }); //End find one

});

module.exports = router;
