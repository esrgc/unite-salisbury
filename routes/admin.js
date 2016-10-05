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
  res.render('admin/index', {
    title: 'Administration',
    message: req.flash('flashMessage'),
    rootPath: ''
  });
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
    res.redirect('manageUser');
  }
});

//get user managing page
router.get('/manageUser', function(req, res) {
  //grab data with paging
  //data at first page
  //get query strings
  var data = req.query;

  //params setup
  var pageIndex = (data.page - 1) || 0,
    pageSize = data.size || 20,
    sortBy = data.sortBy || 'firstName',
    order = data.order || 'asc',
    searchBy = data.searchBy || '',
    search = data.search || ''

  sortOrder = '';

  //setup sortby order for query criteria
  if (order == 'desc')
    sortOrder = '-' + sortBy;


  //retrieve users
  var query = null;

  if (search != '') { //search
    var criteria = {};
    criteria[searchBy] = new RegExp('^' + search + '$', "i");
    query = User.find(criteria);
  } else
    query = User.find();

  //paging and sort then executes
  query.skip(pageIndex * pageSize)
    .limit(pageSize)
    .sort(sortOrder)
    .exec(function(err, result) {
      if (err) {
        req.flash('flashMessage', 'Error reading data from database. Please try again!');
        res.redirect('/admin');
      }
      //if nothing is wrong render the results
      console.log('Data returned...');
      // console.log(result);
      User.count(function(err, count) {
        console.log(count);
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
          search: search,
          pageCount: parseInt(count / pageSize) || 1
        });
      });
    });
});

//edit user 
router.get('/editUser/:id', function(req, res) {
  var id = req.params.id;
  if (typeof id == 'undefined') {
    console.log('Invalid id');
    req.flash('flashMessage', 'Invalid user id!');
    res.redirect('manageUser');
  }

  //id is valid now find the user
  User.findById(id, function(err, result) {
    if (err) {
      req.flash('flashMessage', 'Error finding user.');
      res.redirect('manageUser');
    }

    console.log('User found!')
    console.log(result);

    res.render('admin/editUser', {
      title: 'Administration',
      user: result,
      rootPath: '../../'
    });
  });

});

router.post('/editUser/:id', function(req, res) {
  var id = req.params.id;
  var data = req.body;
  console.log('Updating user');
  console.log(data);

  //done callback
  var done = function(err, user, validationError) {
    res.render('admin/editUser', {
      title: 'Administration',
      message: req.flash('flashMessage'),
      user: user, //user model that contains previous user data
      valErr: validationError, //show all error messages
      rootPath: '../../'
    });
  };

  User.findById(id, function(err, user) {
    if (err) {
      req.flash('flashMessage', 'Error finding user.');
      res.redirect('manageUser');
    }
    //no error now bind new updated data
    helpers.copy(user, data);
    //validate
    var validateErr = user.validateSync();
    //validation errors occur
    if (typeof validateErr != 'undefined') {
      console.log('validation error in admin/editUser:');
      console.log(validateErr);
      req.flash('flashMessage', "Data entered is invalid. Please try again!");
      return done(true, user, validateErr);
    }
    //if no error save
    user.save(function(err) {
      if (err) {
        req.flash('flashMessage', "Error saving data. Please try again!");
        return done(true, user, null);
      } else {
        req.flash('flashMessage', "User has been updated successfully!");
        return done(false, user);
      }
    });

  });
});


router.get('/deleteUser/:id', function(req, res, next) {
  var id = req.params.id;
  if (typeof id == 'undefined') {
    req.flash('flashMessage', 'Invalid user id!');
    return res.redirect('../manageUser');
  }
  var result = req.result = {};
  User.findById(id, function(err, user) {
    if (err) {
      result.err = err;
      return next();
    }
    result.err = null;
    result.user = user;
    next();
  });
}, function(req, res) {
  var result = req.result;
  if (result.err) {
    console.log(err);
    req.flash('flashMessage', err.message);
    return res.redirect('../manageUser');
  } else {
    res.render('admin/deleteUser', {
      title: 'Administration',
      user: result.user,
      rootPath: '../../'
    });
  }
});

router.post('/deleteUser/:id', function(req, res, next) {
  var id = req.params.id;
  if (typeof id == 'undefined') {
    req.flash('flashMessage', 'Invalid user id!');
    return res.redirect('../manageUser');
  }
  var result = req.result = {};
  User.findById(id, function(err, user) {
    if (err) {
      result.err = err;
      return next();
    }
    result.err = null;
    //delete the user
    user.remove(function(err, user){
      if(err){
        req.flash('flashMessage', 'Error deleting user!');
        result.err = err;
      }
      else
        next();
    });
  });
}, function(req, res) {
  var result = req.result;
   if (result.err) {
    console.log(err);
    req.flash('flashMessage', err.message);
    return res.redirect('../manageUser');
  } else {
    req.flash('flashMessage', 'User has been deleted!');
    res.redirect('../manageUser');
  }
});

router.get('/manageEvent', function(req, res) {
  res.render('admin/manageEvent', { title: 'Administration' });
});

module.exports = router;
