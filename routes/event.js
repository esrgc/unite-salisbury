
/*
Event map page
*/

var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/map', function(req, res) {
  res.render('map', { title: 'Express' });
});

module.exports = router;
