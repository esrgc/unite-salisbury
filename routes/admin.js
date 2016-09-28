var express = require('express');
var router = express.Router();
var appDomain = require('../appDomain');
var User = appDomain.dataRepository.User;

var helpers = require('../helper');

//is admin middleware (already checks for authentication)
var isLoggedIn = appDomain.authentication.isLoggedIn;
var authorized = appDomain.authorization;

router.use(isLoggedIn);
router.use(authorized.can('access admin'));

router.use(function(req, res, next) {
  res.locals.rootPath = '../';
  next();
});

/* GET admin home page. */
router.get('/', function(req, res) {
  res.render('admin/index', { title: 'Administration', message: req.flash('flashMessage') });
});
//add user route
router.get('/addUser', function(req, res) {
  res.render('admin/addUser', { title: 'Administration' });
});
//add user post
router.post('/addUser', function(req, res, next) {
  //create a new user
  var data = req.body;
  //bind post data to model instance (document)
  var newUser = new User({
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    role: 'user' //default
  });
  console.log(data.email);
  //Now look for email existing
  User.findOne({ email: data.email }, function(err, user) {
    if (err) {
      //error occur
      req.flash('addUserMessage', 'An error has occured while processing. Please try again!');
      req.result = {
        err: true,
        newUser: null
      };
      return next();
    }
    if (user) {
      req.flash('addUserMessage', "That email is already taken. Please try again!");
      req.result = {
        err: true,
        newUser: newUser
      };
      return next();
    } else {
      //check if password == confirmPass
      if (data.confirmPassword != data.password) {
        req.flash('addUserMessage', "Confirmation password does not match. Please try again!");
        req.result = {
          err: true,
          newUser: newUser
        };
        return next();
        //return done(true, newUser);
      }
      //now validate the model
      var validateErr = newUser.validateSync();
      //validation errors occur
      if (typeof validateErr != 'undefined') {
        console.log(validateErr);
        req.flash('addUserMessage', "Data entered is invalid. Please try again!");
        req.result = {
          err: true,
          newUser: newUser,
          valErr: validateErr
        };
        return next();
      }
      //no validation error -> now hash the password
      newUser.password = newUser.generateHash(newUser.password);

      //everything is good now save the user
      newUser.save(function(err) { // save
        if (err) {
          req.flash('addUserMessage', "Error saving data to the database. Please try again!");
          req.result = {
            err: true,
            newUser: newUser
          };
        } else {

          req.result = {
            err: false,
            newUser: newUser
          };
        }
        next();
      }); //End newUser.save
    } //End else
  }); //End find one
}, function(req, res) { //sub-stacked middleware
  var result = req.result;
  result = helpers.copy(result, {
    title: 'Add User',
    message: req.flash('addUserMessage')
  });
  //if error render the form again
  if (result.err) {
    res.render('admin/addUser', result);
  } else {
    req.flash('flashMessage', "User has been added successfully!");
    //redirect to addmin page   
    res.redirect('/admin');
  }
});


router.get('/manageUser', function(req, res) {
  //grab data with paging
  //data at first page
  //get query strings
  var data = req.query;

  //params setup
  var pageIndex = (data.page - 1) || 0,
    pageSize = data.size || 20,
    sortBy = data.sortBy || '',
    order = data.order || 'asc',
    searchBy = data.searchBy || '',
    search = data.search || '';

  //setup sortby order for query criteria
  if (order == 'desc')
    sortBy = '-' + sortBy;

  //retrieve users
  var query = null;

  if (searchBy != '') //search
    query = User.where(searchBy).equals(search);
  else
  	query = User.find();

  //paging and sort then executes
  query.skip(pageIndex * pageSize)
    .limit(pageSize)
    .sort(sortBy)
    .exec(function(err, result) {
      if (err) {
      	req.flash('flashMessage', 'Error reading data from database. Please try again!');
      	res.redirect('/admin');
      }
      //if nothing is wrong render the results
      console.log('Data returned...');
      // console.log(result);
      //render
      res.render('admin/manageUser', {
        title: 'Administration',
        message: req.flash('flashMessage'),
        data: result,
        pageSize: pageSize,
        page: pageIndex + 1,
        sortBy: sortBy,
        order: order,
        searchBy: searchBy,
        search: search
      });
    });


});


router.get('/manageEvent', function(req, res) {
  res.render('admin/manageEvent', { title: 'Administration' });
});

module.exports = router;
