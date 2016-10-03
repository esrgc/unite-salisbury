/*
This defines schema for model Event
*/
// var connectionStr = require('../../config').database.mongodb;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose.connect(connectionStr);
// Validators ============================================

var nameValidator = function( name ){
    //Capitalize
    console.log( "Validate", name );
    return true;
}

var startDateValidator = function( startDate ){
  var now = new Date();
    console.log( "Validate", startDate );
  return true;
}

var endDateValidator = function( endDate ){
  var now = new Date();
  if( endDate < now )
    return false
  console.log( "Validate", endDate );
  return true;
}

var EventSchema = new Schema({

  // id: String,
  _creator: { type: Schema.Types.ObjectId, ref: 'User' }, //populated field
  name:{
    type: String,
    required: [true, "Event name is required"],
    validate: {
        validator: nameValidator,
        message: "Name entered is invalid"
    }
  },
  date: Date,
  detail: {
    description: String,
    startDate:{
      type: Date,
      validate:{
          validator: startDateValidator,
          message: "Start date is invalid"
      }
    },      
    endDate:{
      type: Date,
      validate:{
        validator: endDateValidator,
        message: "End date is invalid"
      }
    },
    address: String,
    city: String,
    state: String,
    ZIP: Number,
    x: Number,
    y: Number
      //other details can be added here
  }
});

module.exports = mongoose.model('Event', EventSchema);
