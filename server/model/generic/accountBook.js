const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");

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


// Combine the base entity schema with the user schema
const AccountBook =  mongoose.model('AccountBook', AccountBookSchema,'app_accountBook');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AccountBook;