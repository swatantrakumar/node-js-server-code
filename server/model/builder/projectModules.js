const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');

// Creating user schema
const ProjectModulesSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    projectCode:String,
    appName:String,
    permission:String,
    public_access:Boolean,
    accro:String,
    color:String,
    index:Number,
    name:String,
    title:String,
    imgPath:String,
    url:String,
    openTarget:String,
    mouseHover:String,
    description:String,
    landing_message:String,
    scope:String,
    restricted_access:Boolean,
    allowed_ips:[Reference],
    menus:[Reference],
});

// Combine the base entity schema with the user schema
const ProjectModules =  mongoose.model('ProjectModules', ProjectModulesSchema,'gnrc_module');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = ProjectModules;