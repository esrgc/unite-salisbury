var express = require('express');
var router = express.Router();
var domain = require('../appDomain');
var User = domain.dataRepository.User; 

router.get('/', function( req, res ){
    console.log( "got route for profile" );
    var done = function( err, user ){
        res.render( 'profile', user );
    }
  
    if( !req.user )
      res.redirect('/');
    else {
      User.findOne({ email: req.user.email }, function( err, user ){
          if( err ){
              req.flash('profileMessage', 'Could not find your profile');
              return done( true, null );
          }
          if( user ){
              return done( false, user );
          }
      });
    }
});

module.exports = router;
