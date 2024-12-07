const mongoose = require('mongoose');
const path = require('path');
const BaseEntity = require("../baseEntity");
const IgnoreNull = require('../ignoreNull');

// Creating user schema
const AccountBookSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    case_id:String,
    caseName:String,
    bookType:String,
    bookName:String,
    fYear:String,
    fDay:String,
    month:String,
    yearCount:Number,
    monthCount:Number,
    dayCount:Number
    
});

// Add a static property for file path
AccountBookSchema.statics.modelFilePath = path.relative(process.cwd(), __filename);


AccountBookSchema.plugin(IgnoreNull);

// Combine the base entity schema with the user schema
const AccountBook =  mongoose.model('AccountBook', AccountBookSchema,'app_accountBook');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AccountBook;