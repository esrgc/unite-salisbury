var express = require('express');
var router = express.Router();

var home = require('./home');
var admin = require('./admin');
var event = require('./eventMap');
var login = require('./login');
var users = require('./users');
var events = require('./events');


/*Site routes*/
router.use('/', home);
router.use('/index', home);
router.use('/admin', admin);
router.use('/eventMap', eventMap);
router.use('/login', login);


//Api routes
router.use('/events', events);
router.use('/users', users);


module.exports = router;
