/*
export domain package
*/

var authentication = require('./authentication');
var dataRepository = require('./dataRepository');
var authorization = require('./authorization');

module.exports = {
	authentication: authentication,
	dataRepository: dataRepository,
	authorization: authorization
};