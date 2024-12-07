const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');

// Creating user schema
const DocPermissionSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    user:Reference,
    userId:String,
    userName:String,
    folderId:String,
    key:String,
    creator:Boolean,
    viewer:Boolean,
    downloader:Boolean,
    authoriser:Boolean,
});

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = DocPermissionSchema;