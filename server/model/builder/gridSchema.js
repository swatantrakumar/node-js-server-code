const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const FormFieldsSchema = require('./formFieldsSchema');
const mapOfStringObject = require('./mapOfString');
const GridFieldsSchema = require('./gridFieldsSchema');
const GridColorSettings = require('./gridColorSettings');

// Creating user schema
const GridSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    child_grid:Boolean,
    name:String,
    grid_name:String,
    label:String,
    type:String,
    grid_class:String,
    add_column_filter:{type:Boolean,default:true},
    call_back_field:String,
    api_params:String,
    api_params_criteria:[String],
    grid_view:String,
    details:{
            type : Map,
            of : mapOfStringObject
            },
    itemNoOfGrid:Number,
    action_buttons:[FormFieldsSchema],
    gridColumns:[GridFieldsSchema],
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
    colorCriteria:[GridColorSettings],
    bulk_download:Boolean,
    grid_page_size:Number,
    export_template:String,
    copyRequired:Boolean,
    heavyDownload:Boolean,
});
// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = GridSchema;