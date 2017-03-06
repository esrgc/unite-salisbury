/*
Event router
*/
'use strict';

var express = require('express');
var router = express.Router();

var auth = require('authorized');
var domain = require('../appDomain');

var User = domain.dataRepository.User;
var Event = domain.dataRepository.Event;

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
  var newEvent = new Event();
  //copy the model properties
  newEvent = Object.assign(newEvent, model);

  //check for existing event
  var promise = Event.findOne({ name: model.name });

  promise.then(function(data) {
    console.log('Checking for existing event...');
    console.log(data);
    if (data != null)
      return res.render('event/add', {
        message: 'Event name entered has already been in use. Please use another name!',
        err: true,
        event: model
      });
    else {

      //parse recurring event to generate schedule
      if (newEvent.repeat) {
        let frequency = newEvent.frequency;
        switch (frequency) {
          case 'daily':
            break;
          case 'weekly':
            if (typeof model.weeklyDayOfWeek == 'undefined')
              return res.render('event/add', {
                message: 'Please specify day of week for weekly recurring!',
                err: true,
                event: model
              });
            newEvent.dayOfWeek = model.weeklyDayOfWeek;

            break;
          case 'monthly':
            //day of week
            if (model.monthlyOnType == 'dayOfWeek') {
              newEvent.dayOfWeek = model.monthlyDayOfWeek;
              newEvent.dayOfWeekCount = model.monthlyDayOfWeekCount;
              console.log('day of week count ' + newEvent.dayOfWeekCount);
            }
            //day of month
            if (model.monthlyOnType == 'dayOfMonth') {
              newEvent.dayOfMonth = model.monthlyDayOfMonth;
            }
            break;
          case 'yearly':
            newEvent.monthOfYear = model.monthOfYear;
            if (model.yearlyDayOfWeekMode == 'true') {
              newEvent.dayOfWeekCount = model.yearlyDayOfWeekCount;
              newEvent.dayOfWeek = model.yearlyDayOfWeek;
            }
            break;
        }
      }
      // console.log(model);

      newEvent.validate((err) => {
        if (err) {
          //do a flash message here
          res.render('event/add', {
            message: 'Error creating new event. Please try again!',
            err: err,
            event: model
          });
        } else {
          //calculate and save model the event recurrence      
          let occurrences = newEvent.calculateOccurences();
          res.render('event/add', {
            message: 'Validated successfully',
            err: null,
            event: model
          });

          //now geocode
          geoCoder.search({ //Use geocoder to lookup
            Street: model.aAddress,
            City: model.city,
            State: model.state,
            ZIP: model.zip
          }, function(err, res) {
            if (err) {
              newEvent.location = null;
              return;
            }
            if (res.candidates.length == 0) { //If no candidates
              req.flash('eventsMessage', 'Could not find that address, please try again.');
              newEvent.location = null;
              return;
            }
            for (var i in res.candidates) {
              var place = res.candidates[i];
              if (place.score > 79) {
                let location = place.location; //Else select first candidate
                newEvent.location = location;
                break;
              }
            }

            // console.log(occurrences);
            console.log('After geocoding...')
            console.log(newEvent);

          });


          return;

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
    }
  }, function(err) {});




});

module.exports = router;
