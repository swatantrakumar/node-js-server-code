const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');

// Creating user schema
const AppUsersGroupSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    name:String,
    appUser:[Reference],
    appUserApprover:[Reference]
});

// Combine the base entity schema with the user schema
const AppUsersGroup =  mongoose.model('AppUsersGroup', AppUsersGroupSchema,'app_users_group');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppUsersGroup;