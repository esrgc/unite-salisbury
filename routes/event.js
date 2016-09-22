
/*
Event map page
*/

var express = require('express');
var router = express.Router();
var domain = require('../appDomain');
var User = domain.dataRepository.User;
var Event = domain.dataRepository.Event;
var geoCoder = require('mdimapgeocoder');


var isLoggedIn = domain.authentication.isLoggedIn;

//middleware makes sure user is logged in before proceeding.
router.use(isLoggedIn);

//set root path
router.use(function(req, res, next) {
  res.locals.rootPath = '../';
  next();
});


/* GET index page. */
router.get('/', function(req, res) {//Lookup users events and load them into panels with edit pencil?
  var done = function( err, user ){
    if( err ){
      return res.render('event/index', { title: "Express",
        message: req.flash('eventsMessage'),
        err: err
      });
    }
    res.render('event/index', { title: "Express", 
      message : req.flash('eventsMessage'),
      user: user
    });
  }
  User.findOne({ email: req.user.email }).populate('events').exec( function( err, user ){
      if( err){
        req.flash('eventsMesssage','Error retrieving events' );
        return done( err );
        }
      if( !user ){
        req.flash('eventsMesssage','Error retrieving events' );
        return done( err ); 
      }
      else
        return done( false, user );
  });

});

//Get add event page
router.get('/add', function( req, res ){
  res.render('event/add');
}); 





/* GET home page. */
router.get('/map', function(req, res) {
  res.render('event/map', { title: 'Express' });
});




//POST routes.........................................................
//Get data from add event page, validate and save
router.post('/add', function( req, res ){
  console.log("Got post for add event");
  var done = function( err ){
    if( err )
      return res.render('event/add');
    res.redirect('/event');
  }

  var data = req.body;
  User.findOne({ email: req.user.email }, function( err, user ){
    if( err )
      return done( true );
    if( !user )
      return done( true );
    var newEvent = new Event({
      name: data.eventTitle,  
      date: new Date(),
      detail:{
        description: data.description,
        startDate: data.startDate,
        startTime: data.startTime,
        endDate: data.endDate,
        endTime: data.endTime
      }
    });
    newEvent.save(function( err ){
      if( err)
        console.log("Error saving", err )
    });
    user.pushEvent( newEvent._id );
    user.save();
    done( false );
  });
});

router.post('/update', function( req, res ){
  console.log("Got POST for event update");

});

router.post('/delete', function( req, res ){
  console.log("Got POST for event delete");
});




module.exports = router;
