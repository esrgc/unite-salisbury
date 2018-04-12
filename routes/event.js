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
var authorized = domain.authorization;

var http = require('http');
geoCoder.browser = false; //for windows

var _ = require('lodash');
var moment = require('moment');


//middle ware to check if user is logged in
//router.use(isLoggedIn);

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
        let occurences = Event.calculateOccurrences(d, start, end);

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
              state: d.state,
              zip: d.zip,
              title: d.name,
              eventUrl: d.url,
              repeating: true
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
          state: d.state,
          zip: d.zip,
          title: d.name,
          eventUrl: d.url,
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
router.get('/add', isLoggedIn, authorized.can('create event'), function(req, res) {
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
router.post('/add', isLoggedIn, authorized.can('create event'), function(req, res) {
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

          console.log('Geocoding address now...!')
          //now geocode
          geoCoder.search({ //Use geocoder to lookup
            Street: model.address.replace('.', ''),
            City: model.city,
            State: model.state,
            ZIP: model.zip
          }, function(err, response) {
            if (err) {
              console.log('Error geocoding...')
              newEvent.location = null;
              return res.render('event/add', {
                message: 'Error locating new event. Please try another address!',
                err: err,
                event: model
              });;
            }
            console.log(response);
            if (response.candidates.length == 0) { //If no candidates
              console.log('No address found...')
              // newEvent.location = null;

              return res.render('event/add', {
                message: 'Error locating new event. Please try another address!',
                err: {},
                event: model
              });;
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
            //saving owner ref
            newEvent._creator = req.user._id;

            // res.render('event/add',{
            //   message: 'validated successfully! can be added',
            //   event: model
            // });
            //save event and return
            let p = newEvent.save();

            p.then(function(data) {
              req.flash('message', 'Event added successfully!')
              return res.redirect('index');
            }, function(error) {
              return res.render('event/add', {
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

//manage route
router.get('/manage', isLoggedIn, function(req, res, next) {
  var user = req.user;
  req.events = [];
  //grab data with paging
  //data at first page
  //get query strings
  var data = req.query;

  //params setup
  var pageIndex = (data.page - 1) || 0,
    pageSize = parseInt(data.pageSize) || 10,
    sortBy = data.sortBy || 'name',
    order = data.order || 'asc',
    searchBy = data.searchBy || 'name',
    search = data.search || '',
    sortOrder = '';

  //setup sortby order for query criteria
  if (order == 'desc')
    sortOrder = '-' + sortBy;

  //retrieve users
  var query = null;

  if (search != '') { //search
    var criteria = {};
    if (user.role == 'admin')
      criteria._creator = user._id;
    // criteria[searchBy] = new RegExp('^' + search + '$', "i");
    criteria[searchBy] = { '$regex': search, '$options': 'i' }
    query = Event.find(criteria);
  } else
    query = Event.find();

  //paging and sort then executes
  query.skip(pageIndex * pageSize)
    .limit(pageSize)
    .populate('_creator')
    .sort(sortOrder)
    .exec(function(err, result) {
      if (err) {
        console.log(err);
        req.flash('message', 'Error reading data from database. Please try again!');
        return res.redirect('index');
      }
      //if nothing is wrong render the results
      console.log('Data returned successfully...');
      // console.log(result);
      Event.count(function(err, count) {
        // console.log(count);
        //render
        res.render('event/manage', {
          message: req.flash('message'),
          data: result,
          pageSize: pageSize,
          page: pageIndex + 1,
          sortBy: sortBy,
          order: order,
          searchBy: searchBy,
          search: search,
          pageCount: Math.ceil(parseFloat(count / pageSize)) || 1
        });
      });
    });


});
//edit event route
router.get('/edit', isLoggedIn, authorized.can('manage event'), function(req, res) {
  var id = req.query.id;
  if (typeof id == 'undefined') {
    req.flash('message', 'No valid ID was provided.');
    res.redirect('manage');
  }

  let p = Event.findOne({ _id: id });

  p.then((data) => {
      let d = data.toObject();
      //got data 
      switch (d.frequency) {
        case 'weekly':
          d.weeklyDayOfWeek = d.dayOfWeek;
          break;
        case 'monthly':
          if (d.dayOfWeekCount != null)
            d.monthlyOnType = 'dayOfWeek';
          else
            d.monthlyOnType = 'dayOfMonth';

          d.monthlyDayOfMonth = d.dayOfMonth;
          d.monthlyDayOfWeekCount = d.dayOfWeekCount;
          d.monthlyDayOfWeek = d.dayOfWeek;
          break;
        case 'yearly':
          d.monthOfYear = d.monthOfYear;
          d.yearlyDayOfWeekMode = (d.dayOfWeekCount != null).toString();
          d.yearlyDayOfWeekCount = d.dayOfWeekCount;
          d.yearlyDayOfWeek = d.dayOfWeek;
          break
      };
      console.log(d);
      res.render('event/edit', {
        event: d
      });
    })
    .catch((err) => {
      //error occurs
      return req.flash('message', 'Error reading from database...');
      res.redirect('manage');
    });
});
//edit event route (POST)
router.post('/edit', isLoggedIn, authorized.can('manage event'), function(req, res) {
  var model = req.body;
  let id = model.id;
  model._id = id;//copy for re-display on error
  console.log('..........Editing Event.............');
  console.log(model);
  let promise = Event.findOne({ _id: id });

  //copy the model properties
  promise.then((data) => {
      let editingEvent = data;

      console.log('found the existing event...');
      editingEvent = Object.assign(editingEvent, model);


      console.log('Updating event.......');
      //parse recurring event to generate schedule
      if (editingEvent.repeat) {
        let frequency = editingEvent.frequency;
        switch (frequency) {
          case 'daily':
            break;
          case 'weekly':
            if (typeof model.weeklyDayOfWeek == 'undefined')
              return res.render('event/edit', {
                message: 'Please specify day of week for weekly recurring!',
                err: true,
                event: model
              });
            editingEvent.dayOfWeek = model.weeklyDayOfWeek;

            break;
          case 'monthly':
            //day of week
            if (model.monthlyOnType == 'dayOfWeek') {
              editingEvent.dayOfWeek = model.monthlyDayOfWeek;
              editingEvent.dayOfWeekCount = model.monthlyDayOfWeekCount;
              console.log('day of week count ' + editingEvent.dayOfWeekCount);
              //clear out day of month so day of week is scheduled
              editingEvent.dayOfMonth = [];
            }
            //day of month
            if (model.monthlyOnType == 'dayOfMonth') {
              editingEvent.dayOfMonth = model.monthlyDayOfMonth;
              //clear out the others
              editingEvent.dayOfWeek = [];
              editingEvent.dayOfWeekCount = null;
            }
            break;
          case 'yearly':
            editingEvent.monthOfYear = model.monthOfYear;
            if (model.yearlyDayOfWeekMode == 'true') {
              editingEvent.dayOfWeekCount = model.yearlyDayOfWeekCount;
              editingEvent.dayOfWeek = model.yearlyDayOfWeek;
            }
            break;
        }
      }
      // console.log(model);
      //validate event
      editingEvent.validate((err) => {
        if (err) {
          //do a flash message here
          return res.render('event/edit', {
            message: 'Error creating new event. Please try again!',
            err: err,
            event: model
          });
        } else { //calculate and save model the event recurrence      
          editingEvent.calculateSchedule();

          //now geocode
          geoCoder.search({ //Use geocoder to lookup
            Street: model.address.replace('.', ''),
            City: model.city,
            State: model.state,
            ZIP: model.zip
          }, function(err, response) {
            console.log(response);
            if (err) {
              editingEvent.location = null;
              // return;
              return res.render('event/edit', {
                message: 'Error locating the address. Please try another address!',
                err: {},
                event: model
              });
            } else {
              if (response.candidates.length == 0) { //If no candidates
                // req.flash('eventsMessage', 'Could not find that address, please try again.');
                console.log('No address found...returning to client!');
                console.log(model);
                return res.render('event/edit', {
                  message: 'Could not locate the address. Please try another address!',
                  err: {},
                  event: model
                });
                editingEvent.location = null;
                // return;
              } else {
                for (var i in response.candidates) {
                  var place = response.candidates[i];
                  if (place.score > 79) {
                    let location = place.location; //Else select first candidate
                    editingEvent.location = location;
                    break;
                  }
                }
              }
            }


            // console.log(occurrences);
            console.log('After geocoding...')
            console.log(editingEvent);
            //saving owner ref
            //editingEvent._creator = req.user._id;

            // res.render('event/edit',{
            //   message: 'validated successfully! can be added',
            //   event: model
            // });
            //save event and return
            let p = editingEvent.save();

            p.then(function(data) {
              req.flash('message', `Event ${data.name} was edited successfully!`)
              return res.redirect('manage');
            }, function(error) {
              return res.render('event/edit', {
                message: 'Error saving event! Please try again!',
                err: error,
                event: model
              });
            })

          });        
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
    })
    .catch((err) => {
      console.log(err);
      //error occurs
      req.flash('message', 'Error reading from database...');
      return res.redirect('manage');
    });



});


//delete event 
router.get('/delete', isLoggedIn, authorized.can('manage event'), function(req, res, next) {
  var id = req.query.id;

  if (typeof id == 'undefined') {
    req.flash('message', 'Invalid event ID. ');
    res.redirect('manage');
    return;
  }

  Event.findById(id, function(err, event) {
    if (err) {
      result.error = err;
      console.log(err);
      req.flash('message', 'Error finding event with id ' + id);
      return res.redirect('manage');
    }

    res.render('event/delete', {
      event: event
    });
  });
});

//delete event post
router.post('/delete', isLoggedIn, authorized.can('manage event'), function(req, res, next) {
  var id = req.body.id;
  if (typeof id == 'undefined') {
    req.flash('message', 'Invalid event ID. ');
    res.redirect('manage');
    return;
  }

  Event.findById(id, function(err, event) {
    if (err) {
      result.error = err;
      console.log(err);
      req.flash('message', 'Error finding event with id ' + id);
      return res.redirect('manage');
    }

    //event found -> delete it
    event.remove(function(err) {
      if (err) {
        result.error = err;
        console.log(err);
        req.flash('message', 'Error deleting event with id ' + id);
        return res.redirect('manage');
      }

      req.flash('message', 'Event has been deleted successfully!');
      res.redirect('manage');
    });
  });
});


module.exports = router;