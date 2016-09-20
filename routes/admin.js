var express = require('express');
var router = express.Router();
var appDomain = require('../appDomain');
//is admin middleware (already checks for authentication)
var isLoggedIn = appDomain.authentication.isLoggedIn;
var authorized = appDomain.authorization;

router.use(isLoggedIn);
router.use(authorized.can('access admin'));

router.use(function(req, res, next) {
  res.locals.rootPath = '../';
  next();
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('admin/index', { title: 'Administration' });
});

module.exports = router;
