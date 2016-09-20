
/*
Event map page
*/

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


/* GET index page. */
router.get('/', function(req, res) {
  res.render('event/index', { title: 'Express' });
});

/* GET home page. */
router.get('/map', function(req, res) {
  res.render('event/map', { title: 'Express' });
});

module.exports = router;
