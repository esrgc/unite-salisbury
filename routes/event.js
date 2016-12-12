/*
Event router
*/

var express = require('express');
var router = express.Router();

var auth = require('authorized');
var domain = require('../appDomain');

User = domain.dataRepository.User;
Event = domain.dataRepository.Event;

var geoCoder = require('../appDomain/mdimapgeocoder');
var isLoggedIn = domain.authentication.isLoggedIn;
var http = require('http');
geoCoder.browser = false; //for windows


//middle ware to check if user is logged in
router.use(isLoggedIn);

//set root path (used to render partials)
var rootPath = '../';
router.use(function(req, res, next) {
  res.locals.rootPath = rootPath;
  next();
});

/*get index page*/
router.get('/', function(req, res){
	res.redirect('event/index');
});

router.get('/index', function(req, res){
	res.render('event/index', {title: 'Event Map'});	
});

router.get('/add', function(req, res){
	res.render('event/add', {title: 'New Event'});
});
//post for add event
router.post('/add', function(req, res){
	var model = req.body;
	console.log(model);

	res.render('event/add', {title: 'New Event'});
});

module.exports = router;