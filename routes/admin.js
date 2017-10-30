var express = require('express');
var router = express.Router();
var appDomain = require('../appDomain');
var User = appDomain.dataRepository.User;
var Event = appDomain.dataRepository.Event;

var geoCoder = require('../appDomain/mdimapgeocoder');

var helpers = require('../helper');

//is admin middleware (already checks for authentication)
var isLoggedIn = appDomain.authentication.isLoggedIn;
var authorized = appDomain.authorization;

router.use(isLoggedIn);
router.use(authorized.can('access admin'));

router.use(function(req, res, next) {
  res.locals.rootPath = '../';
  res.locals.title = 'Administration';
  next();
});

/* GET admin home page. */
router.get('/', function(req, res) {
  res.redirect('admin/index');
});

router.get('/index', function(req, res){
  res.render('admin/index', {
    message: req.flash('flashMessage')
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
    pageSize = parseInt(data.pageSize) || 5,
    sortBy = data.sortBy || 'firstName',
    order = data.order || 'asc',
    searchBy = data.searchBy || '',
    search = data.search || '',
    sortOrder = '';

  //setup sortby order for query criteria
  if (order == 'desc')
    sortOrder = '-' + sortBy;


  //retrieve users
  var query = null;
  var criteria = {};
  
  if (searchBy == 'awaiting approval') {
    query = User.find({approved: false});
  }
  else if (search != '') { //search
    //criteria[searchBy] = new RegExp('^' + search + '$', "i");
    criteria[searchBy] = { '$regex': search, '$options': 'i' }
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
        return res.redirect('index');
      }
      //if nothing is wrong render the results
      console.log('Data returned...');
      // console.log(result);
      User.count(function(err, count) {
        console.log(pageSize);
        //render
        res.render('admin/manageUser', {
          message: req.flash('flashMessage'),
          data: result,
          pageSize: parseInt(pageSize),
          page: pageIndex + 1,
          sortBy: sortBy,
          order: order,
          searchBy: searchBy,
          search: search,
          pageCount: Math.ceil(parseFloat(count / pageSize)) || 1
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

      editUser: result,
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

      message: req.flash('flashMessage'),
      editUser: user, //user model that contains previous user data
      valErr: validationError, //show all error messages
      rootPath: '../../'
    });
  };

  User.findById(id, function(err, user) {
    if (err) {
      req.flash('flashMessage', 'Error finding user.');
      res.redirect('manageUser');
    }

    //encrypt password
    data.password = user.generateHash(data.password);

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

      user: result.user,
      rootPath: '../../'
    });
  }
});
//Delete event post
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
    user.remove(function(err, user) {
      if (err) {
        req.flash('flashMessage', 'Error deleting user!');
        result.err = err;
      } else
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

  //grab data with paging
  //data at first page
  //get query strings
  var data = req.query;

  //params setup
  var pageIndex = (data.page - 1) || 0,
    pageSize = parseInt(data.pageSize) || 5,
    sortBy = data.sortBy || 'name',
    order = data.order || 'asc',
    searchBy = data.searchBy || 'name',
    search = data.search || '',
    sortOrder = '';

  //setup sortby order for query criteria
  if (order == 'desc')
    sortOrder = '-' + sortBy;

  //retrieve users
  var query = null;

  if (search != '') { //search
    var criteria = {};
    // criteria[searchBy] = new RegExp('^' + search + '$', "i");
    criteria[searchBy] = { '$regex': search, '$options': 'i' }
    query = Event.find(criteria);
  } else
    query = Event.find();

  //paging and sort then executes
  query.skip(pageIndex * pageSize)
    .limit(pageSize)
    .populate('_creator')
    .sort(sortOrder)
    .exec(function(err, result) {
      if (err) {
        console.log(err);
        req.flash('flashMessage', 'Error reading data from database. Please try again!');
        return res.redirect('index');
      }
      //if nothing is wrong render the results
      console.log('Data returned successfully...');
      // console.log(result);
      Event.count(function(err, count) {
        // console.log(count);
        //render
        res.render('admin/manageEvent', {
          message: req.flash('flashMessage'),
          data: result,
          pageSize: pageSize,
          page: pageIndex + 1,
          sortBy: sortBy,
          order: order,
          searchBy: searchBy,
          search: search,
          pageCount: Math.ceil(parseFloat(count / pageSize)) || 1
        });
      });
    });
});
//EDIT event 
router.get('/editEvent', function(req, res, next) {
  var id = req.query.id;

  if (typeof id == 'undefined') {
    req.flash('flashMessage', 'Invalid event ID. ');
    res.redirect('manageEvent');
    return;
  }
  var result = req.result = {};
  Event.findById(id, function(err, event) {
    if (err) {
      result.error = err;
      console.log(err);
      return next();
    }
    result.error = false;
    result.event = event;
    console.log('event found');
    console.log(event);

    next();
  });
}, function(req, res) {
  var result = req.result;
  if (result.error) {
    req.flash('flashMessage', 'Error reading event...');
    return res.redirect('manageEvent');
  }
  console.log('Rendering event');
  console.log(result.event);
  res.render('admin/editEvent', { event: result.event });

});
//Edit event post
router.post('/editEvent', function(req, res, next) {
  var id = req.body.id;
  var data = req.body;

  var detail = {
    address: data.streetAddress,
    description: data.description,
    startDate: data.startDate + " " + data.startTime,
    endDate: data.endDate + " " + data.endTime,
    city: data.city,
    state: data.state,
    ZIP: data.zip
  };

  console.log('Updating event...');
  console.log(data);
  var result = req.result = {};

  Event.findById(id, function(err, event) {
    if (err) {
      result.err = err;
      req.flash('flashMessage', 'Error finding Event.');
      res.redirect('manageEvent');
    }

    result.event = event;
    //no error now bind new updated data
    event.name = data.name;
    event.date = new Date();
    event.detail = detail;

    geoCoder.search({ //Use geocoder to lookup
      Street: data.streetAddress,
      City: data.city,
      State: data.state,
      ZIP: data.zip
    }, function(err, resp) {
      if (err) {
        result.err = err;
        req.flash('flashMessage', 'Error geocoding event.');
        return next();
      }
      if (resp.candidates.length == 0) { //If no candidates
        result.err = true;
        req.flash('flashMessage', 'Could not find that address, please try agian.');
        return next();
      }
      var found = false;
      for (i in resp.candidates) {
        var place = resp.candidates[i];
        if (place.score > 79) {
          found = true;
          event.location = place.location;

          //validate
          var validateErr = event.validateSync();
          //validation errors occur
          if (typeof validateErr != 'undefined') {
            console.log('validation error in admin/editEvent:');
            console.log(validateErr);
            req.flash('flashMessage', "Data entered is invalid. Please try again!");
            result.validateErr = validateErr;
            result.err = true;
            return next();
          }

          //if no error save
          event.save(function(err) {
            if (err) {
              req.flash('flashMessage', "Error saving data. Please try again!");
              result.err = err;
              return next();
            } else {
              req.flash('flashMessage', "Event has been updated successfully!");
              return next();
            }
          });
          break;
        }
      }
      if (!found) {
        req.flash('flashMessage', 'Could not find that address, please try agian.');
        next();
      }
    });
  });
}, function(req, res) {
  var result = req.result;
  res.render('admin/editEvent', {
    message: req.flash('flashMessage'),
    event: result.event, //event model that contains previous user data
    valErr: result.validateErr, //show all error messages
    err: result.err
  });
});

//delete event 
router.get('/deleteEvent', function(req, res, next) {
  var id = req.query.id;

  if (typeof id == 'undefined') {
    req.flash('flashMessage', 'Invalid event ID. ');
    res.redirect('manageEvent');
    return;
  }

  Event.findById(id, function(err, event) {
    if (err) {
      result.error = err;
      console.log(err);
      req.flash('flashMessage', 'Error finding event with id ' + id);
      return res.redirect('manageEvent');
    }

    res.render('admin/deleteEvent', {
      event: event
    });
  });
});

//delete event post
router.post('/deleteEvent', function(req, res, next) {
  var id = req.body.id;
  if (typeof id == 'undefined') {
    req.flash('flashMessage', 'Invalid event ID. ');
    res.redirect('manageEvent');
    return;
  }

  Event.findById(id, function(err, event) {
    if (err) {
      result.error = err;
      console.log(err);
      req.flash('flashMessage', 'Error finding event with id ' + id);
      return res.redirect('manageEvent');
    }

    //event found -> delete it
    event.remove(function(err) {
      if (err) {
        result.error = err;
        console.log(err);
        req.flash('flashMessage', 'Error deleting event with id ' + id);
        return res.redirect('manageEvent');
      }

      req.flash('flashMessage', 'Event has been deleted successfully!');
      res.redirect('manageEvent');
    });
  });

});

module.exports = router;
