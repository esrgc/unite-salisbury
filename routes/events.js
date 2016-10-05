/*
This is where restFul API for events is implemented
*/

var express = require('express');
var router = express.Router();
var Domain = require('../appDomain');
var Event = Domain.dataRepository.Event;
/* GET listing of events */
router.get('/', function(req, res) {
  Event.find({}, function( err,events ){
    res.send(events)
  });
  
});

module.exports = router;
