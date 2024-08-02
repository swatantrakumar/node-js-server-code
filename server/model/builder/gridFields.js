const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');
const FormFields = require('./formFields');

// Creating user schema
const GridFieldsSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    availability:[String],
    name:String,
    field_name:String,
    type:String,
    label:String,
    label_type:String,
    editable:Boolean,
    grid_matching:String,
    is_disabled:Boolean,
    is_mandatory:Boolean,
    datatype:String,
    ddn_field:String,
    api_params:String,
    api_params_criteria:[String],
    call_back_field:String,
    onchange_api:Boolean,
    onchange_api_params:String,
    onchange_call_back_field:String,
    onchange_api_params_criteria:[String],
    tree_view_object:FormFields,
    onchange_function:Boolean,
    onchange_function_param:String,
    display_name:String,
    field_class:String,
    show_if:String,
    APIonclick:Reference,
    bulk_download:Boolean,
    gridColumns:[GridFields],
    min_length:Number,
    max_length:Number,
    width:String,
    text_align:String,
    grid:Reference,
    form:Reference,
    fields:[{type:Map}],
    grid_cell_function:String,
    hide_in_inline_grid:String,
    data_template:String,
    format:String,
    onchange_data_template:String,
    sticky:Boolean,
    stickyPosition:String,
    display:Boolean,
    time_format:String,
});

// Combine the base entity schema with the user schema
const GridFields =  mongoose.model('GridFields', GridFieldsSchema,'el_grid_fields');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = GridFields;