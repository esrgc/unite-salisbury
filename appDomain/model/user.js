/*
         This defines schema for model user
         */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//Validators ========================================
//
//
var passwordLength = function(password) {
  return password.length > 7;
}

var passwordCaps = function(password) {
  return /[^A-Z]/g.test(password);
}

var passwordNum = function(password) {
    return /[0-9]/.test(password);
  }
  //Multiple validators with different error messages
var passwordValidators = [
  { validator: passwordLength, message: 'Password must be at least 8 characters long' },
  { validator: passwordCaps, message: 'Password must contain an uppercase character' },
  { validator: passwordNum, message: 'Password must contain a number' }
]

var emailValidate = function(email) {
  if (email.length == 0) {
    return false;
    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
  }
}


//Schema def===========================================
//
//
var UserSchema = new Schema({
  id: String,
  email: {
    type: String,
    required: [true, 'A valid email address is required.'],
    validate: {
      validator: emailValidate,
      message: 'Email entered is invalid.'
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    validate: passwordValidators
  },
  firstName: { type: String, required: [true, 'First name is required'] },
  lastName: { type: String, required: [true, 'Lirst name is required'] },
  role: String,
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }] //populated fields
});


// methods ======================
//
//
//This method makes validation cleaner, ( new User( {email: ...., password: [password, confirmPassword] }) to constructor
UserSchema.post('validate', function() { //middleware to fire after validating, and before saving!
  this.password = this.generateHash(this.password);

});
// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


module.exports = mongoose.model('User', UserSchema);
