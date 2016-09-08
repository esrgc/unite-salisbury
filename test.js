var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.database.mongodb);

var repo = require('./appDomain/dataRepository');

repo.User.find(function(err, users) {

  console.log(users);

});
