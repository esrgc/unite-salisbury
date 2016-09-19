var express = require('express');
var router = express.Router();
var domain = require('../appDomain');
var User = domain.dataRepository.User;

router.get('/edit', function(req, res) {
  var done = function(err, user) {
    res.render('profile', { user: user, rootPath: '../' });
  };

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
module.exports = router;
