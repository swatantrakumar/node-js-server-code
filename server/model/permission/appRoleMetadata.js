const mongoose = require('mongoose');

// Creating appRoleMetaData schema
const AppRoleMetadataSchema = mongoose.Schema({ 
    app_id:String,
    refCode:[String]
});

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppRoleMetadataSchema;