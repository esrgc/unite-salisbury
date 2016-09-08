/*
This defines schema for model Event
*/


// var connectionStr = require('../../config').database.mongodb;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose.connect(connectionStr);

var EventSchema = new Schema({
	_id: String,
	_creator: { type: Number, ref: 'User'},
	name: String,
	date: Date,
	detail: {
		description: String,
		instruction: String
		//other details can be added here
	}
});

module.exports = mongoose.model('Event', EventSchema);