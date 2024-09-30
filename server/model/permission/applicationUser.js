const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');
const S3FolderDataSchema = require('../generic/S3FolderSchema');
const path = require('path');
const IgnoreNull = require('../ignoreNull');

// Creating user schema
const ApplicationUserSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    employee:Reference,
    branch:Reference,
    branches:{type:[Reference],default:undefined},
    accounts:{type:[Reference],default: undefined},
    cognitoId:String,
    code:String,
    name:String,
    username:String,
    email:String,
    mobile1:String,
    mobile2:String,
    action:String,
    designation:String,
    signature:{type:[],default: undefined},
    signature_file:{type:[S3FolderDataSchema],default: undefined},
    signatureUrl:String,
    password:String,
    confirm_password:String,
    commercialCoordinator:Boolean,
    samplerPerson:Boolean,
    sales_person:Boolean,
    departments:{type:[Reference],default: undefined},
    extraUserRole:{type:[Reference],default: undefined},
    list1:{type:[Reference],default: undefined},
    list2:{type:[Reference],default: undefined},
    list3:{type:[Reference],default: undefined},
    user_group:{type:[Reference],default: undefined},
    managerL1:Reference,
    managerL2:Reference,
    managerL3:Reference,
    managerL4:Reference,
    managers:{type:[String],default: undefined},
    roles:{type:[Reference],default: undefined},
    modules:{type:[Reference],default: undefined},
    country:Reference,
    state:Reference,
    login_user_exist:Boolean,
    admin:{type:Boolean,default:false},
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
// ApplicationUserSchema.set('toJSON', { virtuals: true });
// ApplicationUserSchema.set('toObject', { virtuals: true });
    ApplicationUserSchema.set('toJSON', {
        virtuals: true,
        versionKey: false,  // remove __v
        transform: function (doc, ret) {   
        delete ret.id;   // remove `id` field
        return ret;
        }
    });

// Add a static property for file path
ApplicationUserSchema.statics.modelFilePath = path.relative(process.cwd(), __filename);


ApplicationUserSchema.plugin(IgnoreNull);

// Combine the base entity schema with the user schema
const ApplicationUser =  mongoose.model('ApplicationUser', ApplicationUserSchema,'app_application_user');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = ApplicationUser;