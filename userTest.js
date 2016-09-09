var config = require('./config');
var mongoose = require('mongoose');
mongoose.connect( config.database.mongodb );
var User = require('./appDomain').dataRepository.User;
var john = new User({ email: "johntalbot1215@gmail.com", password: "HelloWorld", id: "johntalbot" } );
john.save();
