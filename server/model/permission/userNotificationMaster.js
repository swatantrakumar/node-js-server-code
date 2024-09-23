const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');
const NotificationStatus = require('../../enum/notificationStatus');
const AlertType = require('../../enum/alertType');

// Creating user schema
const UserNotificationMasterSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    userId:Reference,
    message:String,
    notificationStatus:{
        type: String,
        enum: Object.values(NotificationStatus),
        default: NotificationStatus.UNKNOWN,
    },
    notificationType:{
        type: String,
        enum: Object.values(AlertType),
        default: AlertType.EMAIL,
    },
    url:String
});


// Combine the base entity schema with the user schema
const UserNotificationMaster =  mongoose.model('UserNotificationMaster', UserNotificationMasterSchema,'user_notification_master');

module.exports = UserNotificationMaster;