var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.database.mongodb);

var repo = require('../appDomain/dataRepository');
var later = require('later');
var moment = require('moment');

var User = repo.User;
var Event = repo.Event;


// var newUser = new repo.User({email: 'dhoang519@gmail.com'});
// newUser.password = newUser.generateHash('321654d');
// newUser.save();

// repo.User.find(function(err, users) {

//   console.log(users);

// });


var newEvent = new repo.Event({
	name: 'testEvent',
	date: new Date(),
	detail: {
		description: 'test event',
		startDate: new Date(),
		endDate: new Date(),
		address: '123 test street',
		city: 'Salisbury',
		state: 'MD',
		ZIP: '21804',
		repeat: true,
		schedule: '[ { dc: [ 3 ], d: [ 6 ] } ]'
	}	
});
console.log('saving event...');
newEvent.save(function(e){
	if(e){
		console.log(e);
		return;
	}
	console.log('saved event');
});

