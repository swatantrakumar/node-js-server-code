const mongoose = require('mongoose');
const FormSchema = require("./formSchema");

// Combine the base entity schema with the user schema
const Form =  mongoose.model('Form', FormSchema,'el_object_entry_form');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = Form;