const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");

// Creating user schema
const TypoGraphMasterSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    name:String,
    background_color:String,
    color:String,
    font_size:String,
    font_weight:String,
    font_style:String
});

// Combine the base entity schema with the user schema
const TypoGraphMaster =  mongoose.model('TypoGraphMaster', TypoGraphMasterSchema,'app_typoGraphMaster');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = TypoGraphMaster;