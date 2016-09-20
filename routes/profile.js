var express = require('express');
var router = express.Router();
var domain = require('../appDomain');
var User = domain.dataRepository.User;

var isLoggedIn = domain.authentication.isLoggedIn;

//middleware makes sure user is logged in before proceeding.
router.use(isLoggedIn);
//GET..............................................................................
router.get('/', function( req, res ) {
  var done = function( err, user ){
    res.render('profile/index', { user: user, rootPath: '../' });
  };//add for lookup error

  User.findOne({ email: req.user.email }, function( err, user ){
    if( err ){
      req.flash('profileMessage','Could not find your profile');
      return done( true, null );
    }
    if( user ){
      return done( false, user );
    }
  }); 
});

router.get('/edit', function(req, res) {
  var done = function(err, user) {
    res.render('profile/edit', { user: user, rootPath: '../' });
  };//Add for lookup error

  if (!req.user)
    res.redirect('/'); //use isLoggedIn middleware to check for loggin in user
  else {
    User.findOne({ email: req.user.email }, function(err, user) {
      if (err) {
        req.flash('profileMessage', 'Could not find your profile');
        return done(true, null);
      }
      if (user) {
        return done(false, user);
      }
    });
  }
});
router.get('/changePassword', function( req, res ){
  res.render('profile/changePassword', {rootPath: '../'});
});

//POST...............................................................................
router.post('/edit', function(req, res) {
  var done = function(err, user) {
    res.render('profile', {
      user: user,
      message: req.flash('profileMessage'),
      err: err,
      rootPath: '../'
    });
  }

  var data = req.body;
  var updateInstructions = {
    $set: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    }
  }
  var updateOptions = { runValidators: true, new: true };
  User.findOneAndUpdate({ email: req.user.email }, updateInstructions, updateOptions, function(err, user) {
    if (err) {
      console.log("There was an error updating data");
      req.flash('profileMessage', 'Error updating your profile');
      done(err, req.user);
    } else {
      req.flash('profileMessage', "Profile updated successfuly");
      done(null, user);
    }
  });
});

router.post('/changePassword', function(req,res) {
  var done = function( err, user ){
    console.log("Password update finished");
    res.render("<p>:)</p>");
  }
  console.log("Got post");
  done();
});


module.exports = router;
