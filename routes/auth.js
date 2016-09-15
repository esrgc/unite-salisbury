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
  passport.authenticate('local-signup', function(err, user, info) {
    if (err)
      return next(err);

    if (!user) { 
      //need to pass back user to re-display the info that previously typed

      //if error render the sign up page again
      res.render('signup', {
        title: 'Singup',
        req: req,
        message: req.flash('signupMessage'),
        rootPath: '../'
        //user model that contains previous user data
      });
    }
  })(req, res, next);
});

module.exports = router;
