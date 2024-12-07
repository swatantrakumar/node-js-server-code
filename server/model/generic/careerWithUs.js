const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");

// Creating user schema
const CareerWithUsSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    code:String,
    name:String,
    email:String,
    mobile:String,
    location:String,
    qualification:String,
    experience:String
});

// Combine the base entity schema with the user schema
const CareerWithUs =  mongoose.model('CareerWithUs', CareerWithUsSchema,'el_career_withus');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = CareerWithUs;