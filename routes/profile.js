var express = require('express');
var router = express.Router();
var domain = require('../appDomain');
var User = domain.dataRepository.User; 

router.get('/', function( req, res ){
    console.log( "got route for profile" );
    res.render('profile');
});

module.exports = router;
