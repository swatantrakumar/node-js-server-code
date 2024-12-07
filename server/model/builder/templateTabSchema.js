const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');
const FormFieldsSchema = require('./formFieldsSchema');
const FormSchema = require('./formSchema');
const GridSchema = require('./gridSchema');

// Creating user schema
const TemplateTabSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    name:String,
    tab_name:String,
    permission:String,
    label:String,
    heading:String,
    type:String,
    defaultTemplateTab:Boolean,
    form_reference:{type:Map,of:Reference},
    grid_reference:Reference,
    button_field_reference:[Reference],
    grid_list_reference:[Reference],
    chart_list_reference:[Reference],
    // chart_list:[Chart],
    form_view:String,
    grid_view:String,
    multi_grid:Boolean,
    api_params:String,
    api_params_criteria:[String],
    call_back_field:String,
    details:{type:Map},
    forms:{type:Map,of:FormSchema},
    grid:GridSchema,
    buttons:[FormFieldsSchema],
    form:FormSchema,
    grid_list:[GridSchema],
    form_only:Boolean
});

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = TemplateTabSchema;