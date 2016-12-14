/*
This defines schema for model Event
*/
// var connectionStr = require('../../config').database.mongodb;

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
  detail: {
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
      required: [true, 'Please specify if this event repeats.']
    },
    repeatEnd: Date,
    frequency: { type: String, default: 'daily' }, //daily, weekly, monthly, and yearly
    every: { type: Number, default: 1 }, //recurring frequency
    dayOfMonth: [Date], //1,2,3...31
    dayOfWeek: [String], //Monday, Tuesday,...Sunday
    dayOfWeekCount: String, //first, second,...fifth
    monthOfYear: [String], //jan, feb, mar,...dec
    schedule: String, //later.js calculated schedule
    occurences: [Date] //proccessed occurenses

    // repeatFrequency: {
    //   type: String
    // },
    // repeatCustomFreq: {
    //   type: String
    // },



    //other details can be added here
  }
}, {
  validateBeforeSave: false //prevent pre-save validation
});
//calculate how event will occur
EventSchema.methods.calculateOccurences = function() {
  var futureOccurencesCount = 10000;
  // set later to use local time
  later.date.localTime();

  if (typeof this.repeat == 'undefined')
    return;

  var schedule = '',
    occurenses = [];

  try {
    switch (this.repeat) {
      case 'daily':
        schedule = later.parse.recur().every(this.every).dayOfYear();
        break;
      case 'weekly':
        //recurs every # of week
        schedule = later.parse.recur()
          .every(this.every).weekOfYear();
        //on specific days of week
        this.dayOfWeek.forEach(function(d) {
          schedule.on(d).dayOfWeek();
        });
        break;
      case 'monthly':
        //occur every # of month
        schedule = later.parse.recur()
          .every(this.every).month();
        //on days of month
        if (typeof this.dayOfMonth != 'undefined')
          this.dayOfMonth.forEach(function(d) {
            schedule.on(d).dayOfMonth();
          });
        //or on day of week count
        else if (typeof this.dayOfWeek != 'undefined' && this.dayOfWeekCount != 'undefined') {
          //day of week count
          this.dayOfWeekCount.forEach(function(d) {
            schedule.on(d).dayOfWeekCount();
          });
          //day of week
          this.dayOfWeek.forEach(function(d) {
            schedule.on(d).dayOfWeek();
          });
        }
        break;
      case 'yearly':
        //occurs every # year
        schedule = later.parse.recur().every(this.every).year();
        //in months
        if (typeof this.monthOfYear != 'undefined')
          this.monthOfYear.forEach(function(d) {
            schedule.on(d).monthOfYear();
          });

        //on starting day
        if (typeof this.dayOfWeek == 'undefined' && typeof this.dayOfWeekCount == 'undefined') {
          let date = this.startDate.getDate();
          schedule.on(date);
        } else {
          //day of week count
          this.dayOfWeekCount.forEach(function(d) {
            schedule.on(d).dayOfWeekCount();
          });
          //day of week
          this.dayOfWeek.forEach(function(d) {
            schedule.on(d).dayOfWeek();
          });
        }
        break;
    }
  } catch (e) {
    //error has occur
    return null;
  }
  //calculate occurences
  if (typeof this.repeatEnd != 'undefined')
    occurenses =
      later.schedule(schedule)
      .next(futureOccurencesCount, this.startDate, this.repeatEnd);
  else
    occurenses =
      later.schedule(schedule)
      .next(futureOccurencesCount, this.startDate);

  //store results to model
  this.schedule = { schedules: schedule.schedules, exceptions: schedule.exceptions };
  this.occurenses = occurenses;
  return occurenses;
};

module.exports = mongoose.model('Event', EventSchema);
