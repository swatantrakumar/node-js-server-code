const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');

// Creating user schema
const EmailTemplateSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    branch:Reference,
    department:Reference,
    object_name:String,
    page_size:{type:String,default:"A4"},
    name:String,
    mapping_name:String,
    type:String,
    header:String,
    title:String,
    footer:String,
    mailbody:String,
    body:String,
    signature:String,
    from:String,
    to:String,
    ccEmail:String,
    bccEmail:String,
    emailFromName:String,
    obj_id:String,
    subobj_id:String,
    objType:String,
    reminderId:String,
    attachment:Boolean,
    deliveryDate:Date,
    phoneList:[String],
    emailList:[String],
    contentType:String,
    user_id:String,
    userId:String,
    emailGroups:[String],
    headerUrl:String,
    footerUrl:String,
    footerString:String,
    events_text:String,
    sendAsAttachment:[String]
});

// Combine the base entity schema with the user schema
const EmailTemplate =  mongoose.model('EmailTemplate', EmailTemplateSchema,'el_email_template');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = EmailTemplate;