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

var _ = require('lodash');
var moment = require('moment');


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

//event feed for calendar
router.get('/feed', function(req, res) {
  var startStr = req.query.start;
  var endStr = req.query.end;
  console.log(`start: ${startStr} end: ${endStr}`);
  //default start is now
  let start = startStr ? moment(startStr) : moment(),
    //default end is a year from now
    end = endStr ? moment(endStr) : moment().add(1, 'y'),
    events = [];

  Event.find({}, function(err, data) {
    if (err) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
      return;
    }
    //parse events to have have recurring events\
    _.each(data, (d) => {
      //console.log(typeof d.calculateOccurences);
      if (d.repeat) {
        //calculate schedule if not already calculated
        // if (typeof d.schedule == 'undefined')
        //   d.calculateSchedule();
        //calculate occurences
        let occurences = Event.calculateOccurrences(d);
        console.log(occurences);
        // console.log(occurences);
        if (occurences == null)
          return; //no occurrence then move on to the next event
        //now go through all occurences to replicate 
        //repeating events
        _.each(occurences, (occurence) => {
          //check if the occurence is between start and end time

          if (moment(occurence).isBetween(start, end)) {

            var e = {
              id: d._id,
              description: d.description,
              location: d.location,
              address: d.address,
              city: d.city,
              zip: d.zip,
              title: d.name
            };

            //calculate new start and end time
            let startTime = moment(d.start);
            let endTime = moment(d.end);
            let eventDuration = endTime.diff(startTime);
            //new start datetime
            let newStart = moment(occurence);
            newStart.hour(startTime.hour());
            newStart.minute(startTime.minute());
            //new end datetime
            let newEnd = newStart.clone().add(eventDuration, 'ms');
            console.log(`Event duration: ${eventDuration}`);

            //now set displayable datetime
            e.start = newStart.local().format();
            e.end = newEnd.local().format(); //.format('dddd, MMMM Do YYYY, h:mm:ss a');

            //console.log(`start: ${d.start} end: ${d.end}`);
            console.log(`e.start: ${e.start} e.end: ${e.end}\n`);
            // e.occurences = occurences;
            events.push(e);
          }
        });
      } else {
        var firstOccurence = {
          id: d._id,
          description: d.description,
          location: d.location,
          address: d.address,
          city: d.city,
          zip: d.zip,
          title: d.name,
          start: moment(d.start).local().format(),
          end: moment(d.end).local().format()
        };

        //push the first occurence
        events.push(firstOccurence);
      }
    });
    console.log('Success');
    res.json(events);
  }); //get all events

});
//add event route
router.get('/add', function(req, res) {
  var newEvent = new Event();
  res.render('event/add', {
    title: 'New Event',
    event: {
      monthlyOnType: 'dayOfMonth',
      every: 1
    }
  });
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

    if (data != null)
      return res.render('event/add', {
        message: 'Event name entered has already been in use. Please use another name!',
        err: true,
        event: model
      });
    else {
      console.log('No existing event...proceeding to create a new one.');
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
      //validate event
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
          newEvent.calculateSchedule();

          //now geocode
          geoCoder.search({ //Use geocoder to lookup
            Street: model.aAddress,
            City: model.city,
            State: model.state,
            ZIP: model.zip
          }, function(err, response) {
            if (err) {
              newEvent.location = null;
              return;
            }
            if (response.candidates.length == 0) { //If no candidates
              req.flash('eventsMessage', 'Could not find that address, please try again.');
              newEvent.location = null;
              return;
            }
            for (var i in response.candidates) {
              var place = response.candidates[i];
              if (place.score > 79) {
                let location = place.location; //Else select first candidate
                newEvent.location = location;
                break;
              }
            }

            // console.log(occurrences);
            console.log('After geocoding...')
            console.log(newEvent);

            // res.render('event/add',{
            //   message: 'validated successfully! can be added',
            //   event: model
            // });
            //save event and return
            let p = newEvent.save();

            p.then(function(data) {
              req.flash('message', 'Event added successfully!')
              res.redirect('index');
            }, function(error) {
              res.render('event/add', {
                message: 'Error saving event! Please try again!',
                err: error,
                event: model
              });
            })

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
  });
});

//edit event route

//edit event route (POST)



module.exports = router;
