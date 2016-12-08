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
    'change #frequency-control': 'onFrequencyChange',
    'click #monthly-on .radio': 'onMonthlyFreqTypeSwitch',
    'click #yearly-day-of-month-switch': 'onYearlyDayOfMonthSwitch'
  },
  onRepeatSwitch: function(e) {
    var value = $(e.target).is(':checked');
    // console.log(value);

    if (value) {
      this.$('#repeat-frequency-controls').addClass('active');
    } else {
      this.$('#repeat-frequency-controls').removeClass('active');
    }
  },
  onFrequencyChange: function(e) {
    let value = $(e.target).val();
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
  },
  onMonthlyFreqTypeSwitch: function(e) {
    let value = $(e.target).val();
    //console.log(value);
    this.$('#monthly-on .monthly-freq-type').removeClass('active');
    if (value != '') {
      switch (value) {
        case 'each':
          this.$('#monthly-on #monthly-on-each').addClass('active');
          break;
        case 'on':
          this.$('#monthly-on #monthly-on-day-of-month').addClass('active');
          break;
      }
    }
  },
  onYearlyDayOfMonthSwitch: function(e) {
    var value = $(e.target).is(':checked');
    if (value) {
      this.$('#yearly-on-day-of-month-container').addClass('active');
    } else {
      this.$('#yearly-on-day-of-month-container').removeClass('active');
    }
  },
  //private functions
  setRecurringStatus: function(repeatType, every, onType, day, dayOfWeek, dayOfWeekCount, month, year) {
    if (typeof repeatType == 'undefined')
      return;
    let reapeatStatus = 'Occurs ';

    switch (repeatType) {
      case 'daily';
      	reapeatStatus += `every ${every} day(s)`;
      	break;
      case 'weekly':
      	reapeatStatus += `every ${every} week(s) on ${dayOfWeek}`;
        break;
      case 'monthly':
        break
      case 'yearly':
        break;
    }

    return reapeatStatus;
  }
});

module.exports = AddEvent;
