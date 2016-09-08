/*
Database repository as a work unit that includes
Mongoose models
*/

var User = require('../model/user');
var Event = require('../model/event');

module.exports = {
	User: User,
	Event: Event
};