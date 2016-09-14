/*
	 This defines schema for model user
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
	id: String,
		email: {
			type:String,
			validate:{
				validator: function( email ){
					if(email.length == 0 )//required
						return false;

					return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( email );
				},
				message: 'email is required or invalid.'
			},
		},
		password: {
			type: String,
			validate:{
				validator: function( password ){
					//only verify password rule here such as (uppercase, number included....)
					if(password.length == 0 || password.length < 8)
						return false;//password is required and has to be more than 8 chars
					//check for uppercase
					//...to be implemented
					//check for number 
					//..to be implemented
					else
						return true;
				},
				message: 'Password does not meet requirements'
			}
		},
		firstName: String,
		lastName: String,
		role: String,
		events: [{ type: Schema.Types.ObjectId, ref: 'Event' }] //populated fields
});

// methods ======================
//This method makes validation cleaner, ( new User( {email: ...., password: [password, confirmPassword] }) to constructor
UserSchema.post('validate', function(){//middleware to fire after validating, and before saving!
		// if( this.password[1] ){//if the model contains something at index 1, hash index 0 and null index 1
		// 	this.password[0] = bcrypt.hashSync( this.password[0], bcrypt.genSaltSync(8), null );
		// 	this.password[1] = null;	
		// }

		//extra logic after validation completes
		//1) hash the password
		this.password = this.generateHash(this.password);
			
});

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password[0]);
};

// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


module.exports = mongoose.model('User', UserSchema);
