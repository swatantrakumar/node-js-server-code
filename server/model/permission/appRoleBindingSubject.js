const mongoose = require('mongoose');
const Reference = require('../reference');

// Creating user schema
const AppRoleBindingSubjectSchema = mongoose.Schema({ 
    appApplicationUser:Reference,
    appUserGroup:Reference,
    appUserGroupOfGroup:Reference,
    assignedType:String
});


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppRoleBindingSubjectSchema;