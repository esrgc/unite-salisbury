/*
export domain package
*/

var authentication = require('./authentication');
var dataRepository = require('./dataRepository');

module.exports = {
	authentication: authentication,
	dataRepository: dataRepository
};