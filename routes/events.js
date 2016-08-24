/*
This is where restFul API for events is implemented
*/

var express = require('express');
var router = express.Router();

/* GET listing of events */
router.get('/', function(req, res) {
  res.send('Some json data ')
});

module.exports = router;
