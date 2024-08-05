const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');

// Creating user schema
const MenuSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    label:String,
    name:String,
    permission:String,
    defaultMenu:Boolean,
    public_access:Boolean,
    description:String,
    templateId:String,
    templateName:String,
    template:Reference,
    submenu_reference:[Reference],
    submenu:[this],
    module_name:String,
    appName:String,
    index:{type:Number,default:-1},
    moduleId:String,
    module:Reference,
});



// Combine the base entity schema with the user schema
const Menu =  mongoose.model('Menu', MenuSchema,'el_menu');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = Menu;