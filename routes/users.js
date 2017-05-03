/*
This is where restFul API for user is implemented
*/

var express = require('express');
var router = express.Router();

var domain = require('../appDomain');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});


module.exports = router;
