
/*
Event map page
*/

var express = require('express');
var router = express.Router();
var domain = require('../appDomain');
var User = domain.dataRepository.User;
var Event = domain.dataRepository.Event;

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
  var done = function( err, events ){
    if( err ){
      return res.render('event/index', { title: "Express",
        message: req.flash('eventsMessage') 
      });
    }
    res.render('event/index', { title: "Express", 
      message : req.flash('eventsMessage')
    });
  }
  //Find user and use the populate to grab the users event models too
  User.findOne({ email: req.user.email }, function( err, user ){
    if( err ){
      req.flash('eventsMessage', "Error loading your events");
      return done( true );
    }
    return done(false);
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
  var data = req.body;
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
  console.log( "Data is", data, req.user, newEvent );
});

router.post('/update', function( req, res ){
    console.log("Got POST for event update");

});

router.post('/delete', function( req, res ){
    console.log("Got POST for event delete");
});




module.exports = router;
