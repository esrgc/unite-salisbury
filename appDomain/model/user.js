/*
This defines schema for model user
*/


// var connectionStr = require('../../config').database.mongodb;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose.connect(connectionStr);

var UserSchema = new Schema({
	_id: String,
	username: String,
	password: String, //for now. Need encryption later
	firstName: String,
	lastName: String,
	email: String,
	events: [{type: Schema.Types.ObjectId, ref: 'Event'}] //populated fields
});

module.exports = mongoose.model('User', UserSchema);