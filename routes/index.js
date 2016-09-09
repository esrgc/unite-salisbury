var express = require('express');
var router = express.Router();

var home = require('./home');
var admin = require('./admin');
var eventMap = require('./eventMap');
var login = require('./login');
var user = require('./user');
var event = require('./event');
var create = require('./create');

/*Site routes*/
router.use('/', home);
router.use('/index', home);
router.use('/admin', admin);
router.use('/eventMap', eventMap);
router.use('/login', login);
router.use('/create', create);

//Api routes
router.use('/event', event);
router.use('/user', user);


module.exports = router;
