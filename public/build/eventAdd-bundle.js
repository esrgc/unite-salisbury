/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	Author: Tu Hoang
	Dec 2016
	
	add event script
	-Controls form elements to implement repeat event data 
	*/
	
	var AddEvent = __webpack_require__(1);
	
	var startup = function startup() {
	
	  var view = new AddEvent({ el: '#event-form' });
	};
	
	//fire up the app
	$(function () {
	  console.log('Starting up....');
	  startup();
	});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';
	
	/*
	Author: Tu Hoang
	Dec 2016
	
	Require webpack
	*/
	
	// var AddEvent = class AddEvent extends Backbone.View {
	//  constructor (elementID) {
	//    super({el: elementID});
	//    this.name = 'AddEventView';
	//    // this.el = elementID;
	//    console.log(`Initializing ${this.name}`);
	
	//    this.events = {
	//      'click #repeat-switch': 'switch'
	//    };
	
	//  }
	//  switch(event) {
	//    console.log('Checkbox clicked');
	//  }
	// };
	
	
	var AddEvent = Backbone.View.extend({
	  name: 'AddEvent',
	  initialize: function initialize(tagID, eventModel) {
	    this.el = tagID;
	
	    // //bind model to view
	    // if(typeof eventModel == 'undefined')
	    //  this.model = new Backbone.Model({
	    //    //add details if neccesary
	    //  });
	    // else
	    //  this.model = eventModel;
	
	    // console.log(`View ${this.name} initialized`);
	
	
	    //verify checked status on repeat
	    // var value = $('#repeat-switch').is(':checked');
	
	    // if (value) {
	    //   this.$('#repeat-frequency-controls').addClass('active');
	    // } else {
	    //   this.$('#repeat-frequency-controls').removeClass('active');
	    // }
	    var every = this.$('#every-count').val();
	    var frequency = this.$('#frequency-control').val();
	    if (every) {
	      var txtPrompt = this.setRepeatFreq(frequency, every);
	      this.$('#repeat-summary').text(txtPrompt);
	    }
	
	    //initiate datetime picker
	    // this.$('input[role="datetime-picker"]').datetimepicker();
	    $('#start').datetimepicker();
	    $('#end').datetimepicker({
	      useCurrent: false //Important! See issue #1075
	    });
	    $("#start").on("dp.change", function (e) {
	      $('#end').data("DateTimePicker").minDate(e.date);
	    });
	    $("#end").on("dp.change", function (e) {
	      $('#start').data("DateTimePicker").maxDate(e.date);
	    });
	    $("#repeatEnd").datetimepicker({
	      format: 'MM/DD/YYYY'
	    });
	  },
	  events: {
	    'click #repeat-switch': 'onRepeatSwitch',
	    'change #frequency-control': 'onFrequencyChange',
	    'click #monthly-on .radio': 'onMonthlyFreqTypeSwitch',
	    'click #yearly-day-of-week-count-switch': 'onYearlyDayOfWeekCountSwitch',
	    'change #every-count': 'onEveryCountChange'
	
	  },
	  onRepeatSwitch: function onRepeatSwitch(e) {
	    var value = $(e.target).is(':checked');
	    // console.log(value);
	
	    if (value) {
	      this.$('#repeat-frequency-controls').addClass('active');
	    } else {
	      this.$('#repeat-frequency-controls').removeClass('active');
	    }
	  },
	  onFrequencyChange: function onFrequencyChange(e) {
	    var value = $(e.target).val();
	    console.log(value);
	    this.$('.detail-frequency').removeClass('active');
	
	    switch (value) {
	      case 'daily':
	        this.$('#every-type').text('Day(s)');
	        break;
	      case 'weekly':
	        this.$('#every-type').text('Week(s)');
	        this.$('.detail-frequency#weekly-on').addClass('active');
	        break;
	      case 'monthly':
	        this.$('#every-type').text('Month(s)');
	        this.$('.detail-frequency#monthly-on').addClass('active');
	        break;
	      case 'yearly':
	        this.$('#every-type').text('Year(s)');
	        this.$('.detail-frequency#yearly-on').addClass('active');
	        break;
	    }
	    var every = this.$('#every-count').val();
	    var statusText = this.setRepeatFreq(value, every);
	    this.$('#repeat-summary').text(statusText);
	  },
	  onMonthlyFreqTypeSwitch: function onMonthlyFreqTypeSwitch(e) {
	    var value = $(e.target).val();
	    //console.log(value);
	    this.$('#monthly-on .monthly-freq-type').removeClass('active');
	    if (value != '') {
	      switch (value) {
	        case 'dayOfMonth':
	          this.$('#monthly-on #monthly-on-each').addClass('active');
	          break;
	        case 'dayOfWeek':
	          this.$('#monthly-on #monthly-on-day-of-week').addClass('active');
	          break;
	      }
	    }
	  },
	  onYearlyDayOfWeekCountSwitch: function onYearlyDayOfWeekCountSwitch(e) {
	    var value = $(e.target).is(':checked');
	    if (value) {
	      this.$('#yearly-on-day-of-week-count-container').addClass('active');
	    } else {
	      this.$('#yearly-on-day-of-week-count-container').removeClass('active');
	    }
	  },
	  onEveryCountChange: function onEveryCountChange(e) {
	    var repeatType = this.$('select#frequency-control').val();
	    var value = $(e.target).val();
	    var statusText = this.setRepeatFreq(repeatType, value);
	    this.$('#repeat-summary').text(statusText);
	  },
	  //private functions
	  setRepeatFreq: function setRepeatFreq(repeatType, every) {
	    if (typeof repeatType == 'undefined') return;
	    var repeatFrequency = 'Event will occur ';
	
	    switch (repeatType) {
	      case 'daily':
	        repeatFrequency += 'every ' + every + ' day(s)';
	        break;
	      case 'weekly':
	        repeatFrequency += 'every ' + every + ' week(s)';
	        break;
	      case 'monthly':
	        repeatFrequency += 'every ' + every + ' month(s)';
	        break;
	      case 'yearly':
	        repeatFrequency += 'every ' + every + ' year(s)';
	        break;
	    }
	
	    return repeatFrequency;
	  }
	});
	
	module.exports = AddEvent;

/***/ })
/******/ ]);
//# sourceMappingURL=eventAdd-bundle.js.map