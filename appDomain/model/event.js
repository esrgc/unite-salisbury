/*
This defines schema for model Event
*/
// var connectionStr = require('../../config').database.mongodb;
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment'); //for datetime math
var later = require('later'); //for recurring event

// mongoose.connect(connectionStr);
// Validators ============================================

//Event schema
var EventSchema = new Schema({

  // id: String,
  _creator: { type: Schema.Types.ObjectId, ref: 'User' }, //populated field
  name: {
    type: String,
    required: [true, "Event name is required"]
      // validate: {
      //   validator: nameValidator,
      //   message: "Name entered is invalid"
      // }
  },
  date: Date,
  location: Object,
  description: {
    type: String,
    required: [true, 'Description required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start Date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End Date required']
  },
  address: {
    type: String,
    required: [true, 'Street Address required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  zip: {
    type: Number,
    required: [true, 'ZIP is required']
  },
  repeat: {
    type: Boolean,
    default: false,
    required: [true, 'Please specify if this event repeats.']
  },
  repeatEnd: { type: Date, default: null },
  frequency: { type: String, default: 'daily' }, //daily, weekly, monthly, and yearly
  every: { type: Number, default: 1 }, //recurring frequency
  dayOfMonth: [{
    type: Number,
    min: [1, 'Please enter date between (1-31)'],
    max: [31, 'Please enter date between (1-31)']
  }], //1,2,3...31 
  dayOfWeek: [{
    type: Number,
    default: [],
    min: [1, 'Please enter date between (1-7)'],
    max: [7, 'Please enter date between (1-7)']
  }], //Monday, Tuesday,...Sunday (1-7)
  dayOfWeekCount: {
    type: Number,
    default: null,
    min: [1, 'Invalid value. Please enter value from 1-5'],
    max: [5, 'Invalid value. Please enter value from 1-5']
  }, //first, second,...fifth (1-5)
  monthOfYear: [{
    type: Number,
    default: null,
    min: [1, 'Invalid value. Please enter value from 1-12'],
    max: [12, 'Invalid value. Please enter value from 1-12']
  }], //jan, feb, mar,...dec (1-12)
  schedule: Schema.Types.Mixed, //later.js calculated schedule
  occurences: [Date] //proccessed occurences

}, {
  validateBeforeSave: false //prevent pre-save validation
});
//calculate how event will occur
EventSchema.methods.calculateOccurences = function(futureRecurring) {
  var scope = this;
  var futureOccurencesCount = futureRecurring || 5000;
  // set later to use local time
  later.date.localTime();

  //not repeated
  if (typeof scope.repeat == 'undefined' || !scope.repeat)
    return;

  var schedule = null,
    occurences = [];

  try {
    switch (scope.frequency) {
      case 'daily':
        schedule = later.parse.recur().every(scope.every).dayOfYear();
        break;
      case 'weekly':
        //recurs every # of week
        schedule = later.parse.recur()
          .every(scope.every).weekOfYear();
        //on specific days of week
        scope.dayOfWeek.forEach(function(d) {
          schedule.on(d).dayOfWeek();
        });
        break;
      case 'monthly':
        //occur every # of month
        schedule = later.parse.recur()
          .every(scope.every).month();
        //on days of month
        if (scope.dayOfMonth.length > 0)
          scope.dayOfMonth.forEach(function(d) {
            schedule.on(d).dayOfMonth();
          });
        //or on day of week count
        else if (scope.dayOfWeek.length > 0 && scope.dayOfWeekCount != null) {
          //day of week count
          schedule.on(scope.dayOfWeekCount).dayOfWeekCount();
          //day of week
          scope.dayOfWeek.forEach(function(d) {
            schedule.on(d).dayOfWeek();
          });
        }
        break;
      case 'yearly':
        //occurs every # year
        schedule = later.parse.recur().every(scope.every).year();
        //in months
        if (scope.monthOfYear.length > 0)
          scope.monthOfYear.forEach(function(d) {
            schedule.on(d).month();
          });
        //day of week or on starting day
        if (scope.dayOfWeek.length > 0 && scope.dayOfWeekCount != null) {
          //day of week count
          schedule.on(scope.dayOfWeekCount).dayOfWeekCount();
          //day of week
          scope.dayOfWeek.forEach(function(d) {
            schedule.on(d).dayOfWeek();
          });
        } else { //on starting day
          let date = scope.startDate.getDate();
          schedule.on(date).dayOfMonth();
        }
        break;
    }
  } catch (e) {
    //error has occur
    console.log(e);
    return null;
  }
  //if schedule was failed to define
  if (schedule == null)
    return null;

  //calculate occurences
  if (scope.repeatEnd != null)
    occurences =
    later.schedule(schedule)
    .next(futureOccurencesCount, scope.startDate, scope.repeatEnd);
  else
    occurences =
    later.schedule(schedule)
    .next(futureOccurencesCount, scope.startDate);

  //store results to model
  scope.schedule = { schedules: schedule.schedules, exceptions: schedule.exceptions };
  scope.occurences = occurences;
  return occurences;
};

module.exports = mongoose.model('Event', EventSchema);
