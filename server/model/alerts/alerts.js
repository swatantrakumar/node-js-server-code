const mongoose = require('mongoose');
const path = require('path');
const IgnoreNull = require('../ignoreNull');
const AlertType = require('../../enum/alertType');
const PushNotificationSchema = require('./pushNotificationSchema');

// Creating user schema
const AlertsSchema = mongoose.Schema({ 
    ...PushNotificationSchema.obj,
    objType:String,
    attachment:Boolean,
    deliveryDate:{type:Date},
    emailList:{type:[String]},
    typeList:{type:[String]},
    contentType:String,
    senderMetadata:{type:Map,of:String},    
    ccList:{type:[String]}
});

// Add a static property for file path
AlertsSchema.statics.modelFilePath = path.relative(process.cwd(), __filename);


AlertsSchema.plugin(IgnoreNull);

// Combine the base entity schema with the user schema
const Alerts =  mongoose.model('Alerts', AlertsSchema,'app_alerts');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = Alerts;