/*
Author: Tu Hoang
Dec 2016

Require webpack
*/


var AddEvent = class AddEvent extends Backbone.View {
	constructor (elementID) {
		super();
		this.name = 'AddEventView';
		console.log(`Initializing ${this.name}`);

		this.events = {};
		
	}
};

module.exports = AddEvent;