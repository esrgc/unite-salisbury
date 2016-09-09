/*
login page goes here
*/

var express = require('express');
var router = express.Router();
var passport = require('../appDomain/authentication').passport;

var domain = require('../appDomain');

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('login', { title: 'Please log in' , message: req.flash('loginMessage') } );
});

router.post('/', passport.authenticate('local-login', {
  successRedirect: '/', // redirect to success page (will be profile page or event map page)
  failureRedirect: '/login', // redirect back to the login page
  failureFlash: true // allow flash messages
}));


module.exports = router;
