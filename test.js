var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.database.mongodb);

var repo = require('./appDomain/dataRepository');

var User = repo.User;


// var newUser = new repo.User({email: 'dhoang519@gmail.com'});
// newUser.password = newUser.generateHash('321654d');
// newUser.save();

// repo.User.find(function(err, users) {

//   console.log(users);

// });

User.findOne({email: 'dhoang519@gmail.com'}, function(err, user){
	// 	user.email = 'dhoang519@gmail.com';
	// user.save();
	console.log('And the user is:');
	console.log(user);

});





