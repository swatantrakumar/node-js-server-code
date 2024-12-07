const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');

// Creating user schema
const AppGroupOfGroupSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    name:String,
    appUser:[Reference],
    appUserApprover:[Reference],
    appGroupList:[Reference]
});

// Combine the base entity schema with the user schema
const AppGroupOfGroup =  mongoose.model('AppGroupOfGroup', AppGroupOfGroupSchema,'app_group_of_group');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppGroupOfGroup;