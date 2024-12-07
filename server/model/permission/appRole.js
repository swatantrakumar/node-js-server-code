const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const AppRoleMetadataSchema = require('./appRoleMetadata');
// const AppActions = require('./appActions');
const AppResourceModule = require('./appResourceModule');

// Creating user schema
const AppRoleSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    name:String,
    appMetaData:[AppRoleMetadataSchema],
    appActionsList:[String],
    appResourceList:{
        type: Map,
        of: AppResourceModule
      }
});

// Combine the base entity schema with the user schema
const AppRole =  mongoose.model('AppRole', AppRoleSchema,'app_role');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppRole;