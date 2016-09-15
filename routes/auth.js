/*
authentication routes go here
*/

var express = require('express');
var router = express.Router();

var domain = require('../appDomain');
var passport = domain.authentication.passport;


/* sign in*/
router.get('/login', function(req, res) {
  var returnUrl = req.query.returnUrl || '';
  res.render('login', {
    title: 'Please log in',
    req: req,
    message: req.flash('loginMessage'),
    rootPath: '../',
    returnUrl: returnUrl
  });
});

// router.post('/login', function(req, res){
//  res.send('OK');
// });
router.post('/login', passport.authenticate('local-login', {
  failureFlash: true // allow flash messages
}), function(req, res) {
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
  res.render('signup', {
    title: 'Singup',
    req: req,
    message: req.flash('signupMessage'),
    rootPath: '../'
  });
});

router.post('/signup', function(req, res, next) {
  //create a new user
  var data = req.body;

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
      res.render('signup', {
        title: 'Singup',
        req: req,
        message: req.flash('signupMessage'),
        rootPath: '../',
        user: user, //user model that contains previous user data
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
      done(true, null);
    }
    if (user) {
      req.flash('signupMessage', "That email is already taken. Please try again!");
      done(true, newUser);
    } else {
      //newUser.password = newUser.generateHash(password); Need to check password first! Hash after validate

      //First check if all feilds are there
      var confirmPass = req.body.confirmPassword;
      //check if password == confirmPass
      if (confirmPass != password) {
        req.flash('signupMessage', "Confirmation password does not match. Please try again!");
        done(true, newUser);
      }
      //now validate the model
      var validateErr = newUser.validateSync();
      //validation errors occur
      if (err) {
        req.flash('signupMessage', "Data entered is invalid. Please try again!");
        done(true, newUser, validateErr); //pass validation errors to re-display
      }
      //everything is good now save the user
      newUser.save(function(err) { // save
        if (err) {
          req.flash('signupMessage', "Error saving data to the database. Please try again!");
          return done(true, newUser);
        } else
          req.logIn(newUser, function(err) { //on save, login
            if (err){
              req.flash('loginMessage', "Error logging in. Please try again!");
              res.redirect('login');//couldn't log in so redirect to login
            }
            //every worked so call done
            return done(false, newUser);
          }); //End req.logIn
      }); //End newUser.save
    } //End else


  }); //End find one

});

module.exports = router;
