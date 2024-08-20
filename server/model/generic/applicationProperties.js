const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");

// Creating user schema
const ApplicationPropertiesSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
      
});

// Combine the base entity schema with the user schema
const ApplicationProperties =  mongoose.model('ApplicationProperties', ApplicationPropertiesSchema,'app_application_properties');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = ApplicationProperties;