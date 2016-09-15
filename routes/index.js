var express = require('express');
var router = express.Router();

var home = require('./home');
var admin = require('./admin');
var eventMap = require('./eventMap');
var auth = require('./auth');
var user = require('./user');
var event = require('./event');
var profile = require('./profile');
// var create = require('./create');

//this middleware is to detect user
router.use(function(req, res, next) {
  if (req.isAuthenticated()) {
  	console.log("router middleware: there's a logged in user");
    res.locals.user = req.user;
  }
  next();
});

/*Site routes*/
router.use('/', home);
router.use('/index', home);
router.use('/admin', admin);
router.use('/eventMap', eventMap);
router.use('/auth', auth);
router.use('/profile', profile );
//Api routes
router.use('/event', event);
router.use('/user', user);



module.exports = router;
