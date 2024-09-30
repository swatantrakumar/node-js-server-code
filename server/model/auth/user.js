// Importing modules
const mongoose = require('mongoose');
const crypto = require('crypto');
const BaseEntity = require("../baseEntity");
 
// Creating user schema
const UserSchema = mongoose.Schema({
    ...BaseEntity.schema.obj,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    user: String,
    hash: String,
    salt: String,    
    mobileNumber:String,
    verificationCode:String,
    passwordResetCode:String,
    resetCodeGenerateTime:{type:Date},
    disableTwoFactorAuthentication:{type:Boolean},
    authenticationCode:{type:String},
    authenticationCodeGenerateTime:{type:Date},
    enabled:{type:Boolean},
    accountStatus:String,
    lastPasswordResetDate:{type:Date},
    lockTime:{type:Date},
    lastLoginTime:{type:Date},
    wrongLoginAttempt:{type:Number},
    wrongLoginAttemptTime:{type:Number},
    todayLoginAttempt:{type:Number}
});
 
// Method to set salt and hash the password for a user
// setPassword method first creates a salt unique for every user
// then it hashes the salt with user password and creates a hash
// this hash is stored in the database as user password
UserSchema.methods.setPassword = function (password) {
 
    // Creating a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex');
 
    // Hashing user's salt and password with 1000 iterations,
    //64 length and sha512 digest
    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
};
 
// Method to check the entered password is correct or not
// valid password method checks whether the user
// password is correct or not
// It takes the user password from the request 
// and salt from user database entry
// It then hashes user password and salt
// then checks if this generated hash is equal
// to user's hash in the database or not
// If the user's hash is equal to generated hash 
// then the password is correct otherwise not
UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password,
        this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

// Extend the schema with BaseEntity methods
// Object.assign(UserSchema, BaseEntity);
 
// Combine the base entity schema with the user schema
const User =  mongoose.model('User', UserSchema,'app_user');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = User;