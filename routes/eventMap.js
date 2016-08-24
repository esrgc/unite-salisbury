/*
Event map page
*/

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('eventMap', { title: 'Express' });
});

module.exports = router;
