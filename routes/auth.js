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

  if(returnUrl === '')
    res.redirect('/');
  else
    res.redirect(returnUrl);
});

//logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/*sign up*/
router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Singup', message: req.flash('signupMessage'), rootPath: '../' });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/', // redirect to success page (will be profile page or event map page)
  failureRedirect: 'signup', // redirect back to the login page
  failureFlash: true // allow flash messages
}));

module.exports = router;
