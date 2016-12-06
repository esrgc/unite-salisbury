/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*
	Author: Tu Hoang
	Dec 2016

	add event script
	-Controls form elements to implement repeat event data 
	*/


	var AddEvent = __webpack_require__(1);

	let startup = function() {
		
	  let view = new AddEvent({el: '#event-form'});
	  
	};

	//fire up the app
	$(() => {
	  startup();
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	/*
	Author: Tu Hoang
	Dec 2016

	Require webpack
	*/


	// var AddEvent = class AddEvent extends Backbone.View {
	// 	constructor (elementID) {
	// 		super({el: elementID});
	// 		this.name = 'AddEventView';
	// 		// this.el = elementID;
	// 		console.log(`Initializing ${this.name}`);

	// 		this.events = {
	// 			'click #repeat-switch': 'switch'
	// 		};

	// 	}
	// 	switch(event) {
	// 		console.log('Checkbox clicked');
	// 	}
	// };


	var AddEvent = Backbone.View.extend({
	  name: 'AddEvent',
	  initialize: function(tagID) {
	    this.el = tagID;
	    console.log(`View ${this.name} initialized`);

	    //verify checked status on repeat
	    // var value = $('#repeat-switch').is(':checked');

	    // if (value) {
	    //   this.$('#repeat-frequency-controls').addClass('active');
	    // } else {
	    //   this.$('#repeat-frequency-controls').removeClass('active');
	    // }
	  },
	  events: {
	    'click #repeat-switch': 'onRepeatSwitch',
	    'change #frequency-control': 'onFrequencyChange'
	  },
	  onRepeatSwitch: function(e) {
	    var value = $(e.target).is(':checked');
	    console.log(value);

	    if (value) {
	      this.$('#repeat-frequency-controls').addClass('active');
	    } else {
	      this.$('#repeat-frequency-controls').removeClass('active');
	    }
	  },
	  onFrequencyChange: function(e) {
	    let value = $(e.target).val();
	    console.log(value);

	    switch (value) {
	      case 'daily':
	        this.$('#every-type').text('Day(s)');
	        break;
	      case 'weekly':
	        this.$('#every-type').text('Week(s)');
	        break;
	      case 'monthly':
	        this.$('#every-type').text('Month(s)');
	        break;
	      case 'yearly':
	        this.$('#every-type').text('Year(s)');
	        break;
	    }
	  }
	});

	module.exports = AddEvent;


/***/ }
/******/ ]);