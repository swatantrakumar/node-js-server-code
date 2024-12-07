const mongoose = require('mongoose');
const path = require('path');
const BaseEntity = require("../baseEntity");
const IgnoreNull = require('../ignoreNull');


// Creating user schema
const PushNotificationSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    title:String,
    message:String,
    sendToAll:Boolean,
    emailFromMailId:String,
    emailFromName:String,
    ccEmail:String,
    bccEmail:String,
    clientId:String  
});

// Add a static property for file path
PushNotificationSchema.statics.modelFilePath = path.relative(process.cwd(), __filename);


PushNotificationSchema.plugin(IgnoreNull);


module.exports = PushNotificationSchema;