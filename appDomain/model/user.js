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
					return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( email );
				},
				message: '{VALUE} is not a valid email.'
			},
		},
		password: {
			type: Array,
			validate:{
				validator: function( password ){
					if( password[1] )
						return( password[0] == password[1] );
					return true;
				},
				message: 'Passwords entered do not match.'
			}
		},
		firstName: String,
		lastName: String,
		events: [{ type: Schema.Types.ObjectId, ref: 'Event' }] //populated fields
});

// methods ======================
//This method makes validation cleaner, ( new User( {email: ...., password: [password, confirmPassword] }) to constructor
UserSchema.post('validate', function(){//middleware to fire after validating, and before saving!
		if( this.password[1] ){//if the model contains something at index 1, hash index 0 and null index 1
			this.password[0] = bcrypt.hashSync( this.password[0], bcrypt.genSaltSync(8), null );
			this.password[1] = null;	
		}
});

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password[0]);
};



module.exports = mongoose.model('User', UserSchema);
