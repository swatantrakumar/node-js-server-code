const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const FormFieldsSchema = require('./formFieldsSchema');
const mapOfStringObject = require('./mapOfString');

// Creating user schema
const FormSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    child_form:Boolean,
    name:String,
    form_name:String,
    label:String,
    type:String,
    form_view:String,
    details:{type:Map},
    tab_list_buttons:[FormFieldsSchema], 
    tableFields:[FormFieldsSchema],
    buttons:[
        {
        type : Map,
        of : mapOfStringObject
        }
    ],
    fields:[
        {
        type : Map,
        of : mapOfStringObject
        }
    ],
    headerFields:[String],
    getLocation:Boolean,
    api_params:String,
    api_params_criteria:[String],
    call_back_field:String    
});

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = FormSchema;