const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");

// Creating userPreference schema
const FieldEnricherPropertiesSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    key:String,
    classNameWithPath:String,
    method:String
});

// Combine the base entity schema with the user schema
const FieldEnricherProperties =  mongoose.model('FieldEnricherProperties', FieldEnricherPropertiesSchema,'field_enricher_properties');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = FieldEnricherProperties;