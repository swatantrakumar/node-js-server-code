const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const ObjectSeriesMethodSchema = require('./objectSeriesMethod');
const ExportedFileNameSchema = require('./exportedFileName');

// Creating user schema
const ClientConfigurationSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    configType:String,
    static_info:{type:Map},
    settings:{type:Map},
    series_methods:[ObjectSeriesMethodSchema],
    pdf_exports:[ExportedFileNameSchema],
    excel_exports:[ExportedFileNameSchema]   
});

// Combine the base entity schema with the user schema
const ClientConfiguration =  mongoose.model('ClientConfiguration', ClientConfigurationSchema,'config_client_configuration');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = ClientConfiguration;