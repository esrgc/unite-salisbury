
/*
Event map page
*/

var express = require('express');
var router = express.Router();
var domain = require('../appDomain');
var User = domain.dataRepository.User;

var isLoggedIn = domain.authentication.isLoggedIn;

//middleware makes sure user is logged in before proceeding.
router.use(isLoggedIn);

//set root path
router.use(function(req, res, next) {
  res.locals.rootPath = '../';
  next();
});


/* GET index page. */
router.get('/', function(req, res) {
  var done = function( err, events ){
     if( err )
       return res.render('event/index', { title: "Express", message: req.flash('eventsMessage') });
      res.render('event/index', {title: "Express", message : req.flash('eventsMessage')});
  }
    
  User.findOne({ email: req.user.email }, function( err, user ){
      if( err ){
          req.flash('eventsMessage', "Error loading your events");
          return done( true );
      }
     req.flash('eventsMessage', "Error loading your events");
     return done(false);
  });
      
});

router.get('/addEvent', function( req, res ){
    res.render('event/addEvent');
}); 
















/* GET home page. */
router.get('/map', function(req, res) {
  res.render('event/map', { title: 'Express' });
});

module.exports = router;
