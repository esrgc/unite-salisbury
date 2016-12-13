/*
This defines schema for model Event
*/
// var connectionStr = require('../../config').database.mongodb;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment'); //for datetime math
var later = require('later');//for recurring event

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
    endRepeat: Date,
    frequency: {type: String, default: 'daily'},//daily, weekly, monthly, and yearly
    every: {type: Number, default: 1},//recurring frequency
    dayOfMonth: [Date], //1,2,3...31
    dayOfWeek: [String],//Monday, Tuesday,...Sunday
    dayOfWeekCount: String,//first, second,...fifth
    monthOfYear: [String],//jan, feb, mar,...dec
    schedule: String,//later.js calculated schedule
    occurences: [Date]//proccessed occurenses

      // repeatFrequency: {
      //   type: String
      // },
      // repeatCustomFreq: {
      //   type: String
      // },
      // repeatEnd: { type: Date }



    //other details can be added here
  }
}, {
  validateBeforeSave: false //prevent pre-save validation
});

module.exports = mongoose.model('Event', EventSchema);
