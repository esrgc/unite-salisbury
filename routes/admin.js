var express = require('express');
var router = express.Router();

//is admin middleware (already checks for authentication)
var isLoggedIn = require('../appDomain').authentication.isLoggedIn;

router.use(isLoggedIn);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('admin', { title: 'Administration' });
});

module.exports = router;
