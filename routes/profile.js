var express = require('express');
var router = express.Router();
var domain = require('../appDomain');
var User = domain.dataRepository.User;

var isLoggedIn = domain.authentication.isLoggedIn;

//middleware makes sure user is logged in before proceeding.
router.use(isLoggedIn);

//set root path
router.use(function(req, res, next) {
  res.locals.rootPath = '../';
  next();
});

//GET..............................................................................
router.get('/', function(req, res) {
  var done = function(err, user) {
    res.render('profile/index', { user: user, rootPath: '' });
  }; //add for lookup error

  User.findOne({ email: req.user.email }, function(err, user) {
    if (err) {
      req.flash('profileMessage', 'Could not find your profile');
      return done(true, null);
    }
    if (user) {
      return done(false, user);
    }
  });
});

router.get('/edit', function(req, res) {
  var done = function(err, user) {
    res.render('profile/edit', { user: user });
  }; //Add for lookup error

  // if (!req.user)
  //   res.redirect('/'); //use isLoggedIn middleware to check for loggin in user
  // else {
  User.findOne({ email: req.user.email }, function(err, user) {
    if (err) {
      req.flash('profileMessage', 'Could not find your profile');
      return done(true, null);
    }
    if (user) {
      return done(false, user);
    }
  });
  // }
});

router.get('/changePassword', function(req, res) {
  res.render('profile/changePassword');
});

//POST...............................................................................
router.post('/edit', function(req, res) {
  var done = function(err, user) {
    res.render('profile', {
      user: user,
      message: req.flash('profileMessage'),
      err: err
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
      return done(err, req.user);
    } else
      req.flash('profileMessage', "Profile updated successfuly");
    done(null, user);

  });
});


router.post('/changePassword', function(req, res) {
  var done = function(err, user) {
    console.log("Done change password post", err);
    if (err)
      res.render('profile/changePassword', {
        message: req.flash('profileMessage'),
        err: err
      });
    else
      res.render("profile/changePassword", {
        message: req.flash('profileMessage')
      });
  }

  var data = req.body;

  if (data.confirmPassword != data.password) { //Confirm new password
    req.flash('profileMessage', "Confirmation password does not match. Please try again!");
    return done(true);
  }

  User.findOne({ email: req.user.email }, function(err, user) {
    if (err) {
      console.log("Error updating password");
      req.flash('profileMessage', 'Error updating your profile');
      return done(err, req.user);
    }
    if (user) {
      if (!user.validPassword(data.currentPassword)) { //Check current password
        req.flash('profileMessage', "Invalid current password");
        return done(true);
      }

      user.password = data.password; //Set new password
      var validateErr = user.validateSync();
      if (validateErr) {
        req.flash('profileMessage', "Error updating password")
        return done(validateErr);
      }
      user.password = user.generateHash(data.password);
      user.save();
      req.flash('profileMessage', "Password changed successfuly!");
      done(false);
    }
  });
});

module.exports = router;
