/*
Tu Hoang
Sept 2016

Authorized module

*/
var authorized = require('authorized');


//getter for 'admin role'
authorized.role('admin', function(req, done) {
  var user = req.user;
  if (typeof user == 'undefined')
    done(new Error('User was not found'));
  else {
  	done(null, user.role == 'admin');
  }
});

//action for admin
authorized.action('is Admin', ['admin']);

module.exports = authorized;
