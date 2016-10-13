var express = require('express');
var router = express.Router();
var domain = require('../appDomain');
var Event = domain.dataRepository.Event;
router.get('/', function( req, res ){
  var data = req.query;

  //simplified params setup
  var pageIndex = (data.page - 1) || 0,
    pageSize = data.size || 5,
    searchBy = data.searchBy || '',
    search = data.search || '';

  //retrieve users
  var query = null;

  if (search != '') { //search
    var criteria = {};
    criteria[searchBy] = { '$regex': search, '$options': 'i' }
    query = Event.find(criteria);
  } else
    query = Event.find();

  //paging and sort then executes
  query.skip(pageIndex * pageSize)
    .limit(pageSize)
    .sort('date')
    .exec(function(err, result) {
      if (err) {
        req.flash('flashMessage', 'Error reading data from database. Please try again!');
        res.redirect('../');
      }
      Event.count(function(err, count) {
        res.render('event/list', {
          message: req.flash('flashMessage'),
          events: result,
          pageSize: pageSize,
          page: pageIndex + 1,
          searchBy: searchBy,
          search: search,
          pageCount: parseInt(count / pageSize) || 1
        });
      });
    });
});

module.exports = router;
