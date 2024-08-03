const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');
const S3FolderData = require('../generic/S3FolderData');

// Creating user schema
const ApplicationUserSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    employee:Reference,
    branch:Reference,
    branches:[Reference],
    accounts:[Reference],
    cognitoId:String,
    code:String,
    name:String,
    username:String,
    email:String,
    mobile1:String,
    mobile2:String,
    action:String,
    designation:String,
    signature:[],
    signature_file:[S3FolderData],
    signatureUrl:String,
    password:String,
    confirm_password:String,
    commercialCoordinator:Boolean,
    samplerPerson:Boolean,
    sales_person:Boolean,
    departments:[Reference],
    extraUserRole:[Reference],
    list1:[Reference],
    list2:[Reference],
    list3:[Reference],
    user_group:[Reference],
    managerL1:Reference,
    managerL2:Reference,
    managerL3:Reference,
    managerL4:Reference,
    managers:[String],
    roles:[Reference],
    modules:[Reference],
    country:Reference,
    state:Reference,
    login_user_exist:Boolean,
    admin:Boolean,
    branch_admin:Boolean,
    crm:Boolean,
    selfData:Boolean,
    serviceStatus:String,
    userDiscipline:String
});
// / Define the virtual field
ApplicationUserSchema.virtual('chart')
    .get(function () {
        return this._chart;
    })
    .set(function (value) {
        this._chart = value;
    });
// Ensure virtual fields are included when converting to JSON and objects
ApplicationUserSchema.set('toJSON', { virtuals: true });
ApplicationUserSchema.set('toObject', { virtuals: true });

// Combine the base entity schema with the user schema
const ApplicationUser =  mongoose.model('ApplicationUser', ApplicationUserSchema,'app_application_user');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = ApplicationUser;