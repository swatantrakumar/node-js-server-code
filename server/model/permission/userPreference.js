const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');
const AppResourceModule = require('./appResourceModule');

// Creating user schema
const UserPreferenceSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    userId:Reference,
    preferenceMap:{type:Map,of:AppResourceModule}
});


// Combine the base entity schema with the user schema
const UserPreference =  mongoose.model('UserPreference', UserPreferenceSchema,'user_preference');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = UserPreference;