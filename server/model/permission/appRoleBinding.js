const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const AppRoleBindingSubject = require('./appRoleBindingSubject');
const Reference = require('../reference');

// Creating user schema
const AppRoleBindingSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    name:String,
    appRoleBindingSubjectList:[AppRoleBindingSubject],
    appRoleList:[Reference]
});

// Combine the base entity schema with the user schema
const AppRoleBinding =  mongoose.model('AppRoleBinding', AppRoleBindingSchema,'app_role_binding');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppRoleBinding;