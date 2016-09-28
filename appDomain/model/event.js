/*
This defines schema for model Event
*/
// var connectionStr = require('../../config').database.mongodb;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose.connect(connectionStr);

var EventSchema = new Schema({
	// id: String,
	_creator: { type: Number, ref: 'User'},//populated field
	name: String,
	date: Date,
	detail: {
		description: String,
		startDate: Date,
		endDate: Date,
		address: String,
		x: Number,
		y: Number
		//other details can be added here
	}
});

module.exports = mongoose.model('Event', EventSchema);
