var express = require('express');
var router = express.Router();

//is admin middleware (already checks for authentication)
var isAdmin = require('../appDomain').authentication.isAdmin;
//authorize the route
router.use(isAdmin);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('admin', { title: 'Express' });
});

module.exports = router;
