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
    console.log('Authorizing user now....');
    console.log('User %s', user.firstName );
    if (typeof user.role != 'undefined') {
      console.log('Retrieving role information...');
      console.log(user.role);
      done(null, user.role == 'admin');
    } else {
      console.log('No role information found...');
      done(null, false);
    }
  }
});

//action for admin
authorized.action('access admin', ['admin']);

module.exports = authorized;
