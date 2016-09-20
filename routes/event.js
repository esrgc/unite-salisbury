
/*
Event map page
*/

var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res) {
  res.render('event/index', { title: 'Express' });
});

/* GET home page. */
router.get('/map', function(req, res) {
  res.render('event/map', { title: 'Express' });
});

module.exports = router;
