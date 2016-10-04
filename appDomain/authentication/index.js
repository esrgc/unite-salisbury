/*
Code to handle authentication and authorization

middlewares for authentication
*/
var passport = require('./passport');
var config = require('../../config');

var isLoggedIn = function(req, res, next) {
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();
  console.log(req.get('host'));
  // if they aren't redirect them to the home page
  req.flash('loginMessage', 'Please login to access this page!');
  res.redirect(config.mountedPath + '/auth/login?returnUrl=' + req.originalUrl);
};

//now export to middlewares
module.exports = {
  // route middleware to make sure a user is logged in
  isLoggedIn: isLoggedIn,
  passport: passport
};
