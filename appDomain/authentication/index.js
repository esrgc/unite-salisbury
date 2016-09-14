/*
Code to handle authentication and authorization

middlewares for authentication
*/
var passport = require('./passport');
var isLoggedIn = function(req, res, next) {
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  req.flash('isLoggedInMessage', 'Please login to access this page!');
  res.redirect('/auth/login');
};
var isAdmin = function(req, res, next) {
  //first check if the user is logged in
  isLoggedIn(req, res, function(req, res, next) {
    //now check if the user is an admin
    console.log(req.cookies);

    return next();
  });


};
var isCreator = function(req, res, next) {
  //first check if the user is logged in
  isLoggedIn(req, res, function(req, res, next) {
    //now check if the user is a creator


    return next();
  });
};

//now export to middlewares
module.exports = {
  // route middleware to make sure a user is logged in
  isLoggedIn: isLoggedIn,
  isAdmin: isAdmin,
  isCreator: isCreator,
  passport: passport
};
