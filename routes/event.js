/*
Event map page
*/

var express = require('express');
var auth = require('authorized');
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
      return done( true ); 
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

router.get('/update/:id', function( req, res ){
  var id = req.params.id;
  console.log("Got POST for event update", id);

});
//Make DELETE
router.get('/delete/:id', 
  auth.can('manage event'), function( req, res ){
    var id = req.params.id;
    var done = function( err ){
      res.redirect('/event');
    }
    Event.remove({ _id: id }, function( err, event ){
      if( err ){
        req.flash('eventsMessage', "Error looking up event" );
        return done( err );
      }
      if( !event ){
        req.flash('eventsMessage', "Could not find event");
        return done( );
      }
      console.log( "Event ", event );
      return done( false );
    });
  });
//POST routes.........................................................
//Get data from add event page, validate and save
router.post('/add', function( req, res ){
  console.log("Got post for add event");
  var done = function( err ){
    if( err )
      return res.render('event/add', { message: req.flash('eventsMessage') } );
    res.render('event/index', { message: req.flash('eventsMessage') } );

  }

  var data = req.body;
  User.findOne({ email: req.user.email }, function( err, user ){//Find user
    var location;
    if( err )
      return done( true );
    if( !user )
      return done( true );
    console.log( data );
    //Geocode
    geoCoder.search({//Use geocoder to lookup
      Street: data.street,
      City: data.city,
      State: data.state,
      ZIP: data.zip
    }, function( err, res ){
      if( err )
        return done( err );
      if( res.candidates.length == 0 ){//If no candidates
        req.flash('eventsMessage', 'Could not find that address, please try agian.');
        return done( true );
      }
      location = res.candidates[0].location;//Else select first candidate

      var newEvent = new Event({//Create new event model
        name: data.eventTitle,  
        _creator: user._id,
        date: new Date(),
        detail:{
          description: data.description,
          startDate: data.startDate,
          startTime: data.startTime,
          endDate: data.endDate,
          endTime: data.endTime
        }
      });
      //Add validation step
      newEvent.save(function( err ){//Save new event
        if( err)
          console.log("Error saving", err )
      });
      user.pushEvent( newEvent._id );//push event to user
      user.save();//Save user
      done( false );
    });     
  });
});


module.exports = router;
