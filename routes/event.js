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
router.get('/', function(req, res) {
  res.redirect('event/index');
});

router.get('/index', function(req, res) {
  res.render('event/index', { title: 'Event Map', message: req.flash('message') });
});

router.get('/add', function(req, res) {
	var newEvent = new Event();
  res.render('event/add', { title: 'New Event', event: newEvent });
});

//post for add event
router.post('/add', function(req, res) {
  var model = req.body;
  console.log(model);
  console.log('After copying...')
  var newEvent = new Event();
  //copy the model properties
  newEvent = Object.assign(newEvent, model);

  console.log(newEvent);

  newEvent.validate((err) => {
    if (err) {
      //do a flash message here
      res.render('event/add', {
        message: 'Error creating new event. Please try again!',
        err: err,
        event: newEvent
      });
    } else {
      res.render('event/add', {
        message: 'Validated successfully',
        err: null,
        event: newEvent
      });
      return;
      //calculate and save model the event recurrence      
      //newEvent.calculateOccurences();
      // if (newEvent) {
        // newEvent.save((err) => {
        //   if (err)
        //     res.render('event/add', {
        //       event: newEvent,
        //       message: 'Error saving event...Please try again!'
        //     }); //do a flash message and redisplay
        //   else {
        //     req.flash('message', 'Event added successfully!');
        //     res.redirect('/'); //redirect to index page;          
        //   }
        // });
      // }
    }
  });


});

module.exports = router;
