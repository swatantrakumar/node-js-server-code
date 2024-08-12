const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const ColumnListSchema = require('./columnList');

// Creating user schema
const ExportConfigurationSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    collectionName:String,
    name:String,
    applicableForAlias:[String],
    columnLists:[ColumnListSchema],
    pattern:String,
    valuesOnly:{type:Boolean,default:false}
});

// Combine the base entity schema with the user schema
const ExportConfiguration =  mongoose.model('ExportConfiguration', ExportConfigurationSchema,'app_export_configuration');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = ExportConfiguration;