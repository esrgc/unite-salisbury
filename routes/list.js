var express = require('express');
var router = express.Router();
var domain = require('../appDomain');
var Event = domain.dataRepository.Event;
router.get('/', function( req, res ){
  var done = function( err, events ){
    console.log( events );
    res.render('event/list', {
               title: "Event List",
               message: req.flash('listMessage'),
               err: err,
               events: events
              } );
  }
  Event.find({}, function( err, events ){
    if( err ){
      req.flash('listMessage','There was an error loading events'); 
      done( true );
    }
    if( !events ){
      req.flash('listMessage','There were no events found');
      done( true ); 
    }
    done( false, events );
  });

});

module.exports = router;
