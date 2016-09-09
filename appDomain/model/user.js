/*
This defines schema for model user
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var UserSchema = new Schema({
  id: String,
  email: String,
  password: String, //for now. Need encryption later
  firstName: String,
  lastName: String,
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }] //populated fields
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
	
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  var hash = UserSchema.methods.generateHash;
  var oldpass = hash( this.password );
  
 
  return bcrypt.compareSync(password,oldpass);
};


module.exports = mongoose.model('User', UserSchema);
