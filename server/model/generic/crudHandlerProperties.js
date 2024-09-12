const mongoose = require('mongoose');
const path = require('path');
const BaseEntity = require("../baseEntity");
const IgnoreNull = require('../ignoreNull');

// Creating user schema
const CrudHandlerPropertiesSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    key:String,
    crudType:{type : String},
    classNameWithPath:String,
    method:String    
});

// Add a static property for file path
CrudHandlerPropertiesSchema.statics.modelFilePath = path.relative(process.cwd(), __filename);


CrudHandlerPropertiesSchema.plugin(IgnoreNull);

// Combine the base entity schema with the user schema
const CrudHandlerProperties =  mongoose.model('CrudHandlerProperties', CrudHandlerPropertiesSchema,'crud_handler_properties');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = CrudHandlerProperties;