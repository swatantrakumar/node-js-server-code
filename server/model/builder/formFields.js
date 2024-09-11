const mongoose = require('mongoose');
const FormFieldsSchema = require("./formFieldsSchema");

// Combine the base entity schema with the user schema
const FormFields =  mongoose.model('FormFields', FormFieldsSchema,'el_form_fields');


module.exports = FormFields;