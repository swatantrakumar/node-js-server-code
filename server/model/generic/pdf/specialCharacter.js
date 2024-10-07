const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");

// Creating user schema
const SpecialCharacterSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    specialCharacter:String,
    specialCharacterCode:String
});

// Combine the base entity schema with the user schema
const SpecialCharacter =  mongoose.model('SpecialCharacter', SpecialCharacterSchema,'app_special_character');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = SpecialCharacter;