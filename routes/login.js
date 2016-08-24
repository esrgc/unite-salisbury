/*
login page goes here
*/

var express = require('express');
var router = express.Router();

var domain = require('../appDomain');

/* GET users listing. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Please log in'})
});


module.exports = router;
