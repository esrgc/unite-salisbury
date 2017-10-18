/*
Tu Hoang
Sept 2016

Authorized module

*/
var authorized = require('authorized');
var dataRepository = require('../dataRepository');
var Event = dataRepository.Event;

//getter for 'admin role'
authorized.role('admin', function(req, done) {
  var user = req.user;
  if (typeof user == 'undefined')
    done(new Error('User was not found'));
  else {
    console.log('Authorizing user now....');
    console.log('User %s', user.firstName);
    if (typeof user.role != 'undefined') {
      console.log('Retrieving role information...');
      console.log(user.role);
      done(null, user.role == 'admin');
    } else {
      console.log('No role information found...');
      done(null, false);
    }
  }
});


//getter for 'owner role'
authorized.role('editor', function(req, done) {
  console.log(req.body);
  var user = req.user;
  var eventId = req.body.id;
  if (typeof user == 'undefined')
    done(new Error('User was not found'));
  else {
    if(user.role == 'admin')
      return done(null, true);

    console.log("Getting owner info", user);    
    for (i in user.events) //For each event id with user
      if (user.events[i] == eventId) //Check if match to id requested
        return done(null, true); //If yes return authorized

    done(null, false); //Else not authorized
  }
});

//getter for 'approved account'
authorized.role('approved', function(req, done) {
  var user = req.user;
  if (typeof user == 'undefined')
    done(new Error('User was not found'));
  else {
    console.log('Authorizing user now....');
    console.log('User %s', user.firstName);
    if (typeof user.approved != 'undefined') {
      console.log('Retrieving approved information...');
      console.log(user.approved);
      done(null, user.approved);
    } else {
      console.log('No approved information found...');
      done(null, false);
    }
  }
});

//action for admin
authorized.action('access admin', ['admin']);
authorized.action('manage event', ['editor']);
authorized.action('create event', ['approved'])
module.exports = authorized;
