const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const TemplateTab = require('./templateTab');

// Creating user schema
const TemplateSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    name:String,
    module:String,
    permission:String,
    label:String,
    type:String,
    description:String,
    defaultTab:Reference,
    filterTab:TemplateTab,
    filterReference:Reference,
    templateTabs:[TemplateTab],
    tabs:[Reference]
});

// Combine the base entity schema with the user schema
const Template =  mongoose.model('Template', TemplateSchema,'app_form_template');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = Template;