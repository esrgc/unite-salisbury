var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('event/map', { title: 'Map' });
});


module.exports = router;
