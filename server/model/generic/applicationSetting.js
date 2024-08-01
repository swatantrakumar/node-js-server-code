const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const DefaultApplicationSettings = require('./defaultApplicationSettings');
const AuthenticationSettings = require('./authenticationSettings');
const MobileAppSettings = require('./mobileAppSettings');
const ProfileMenuItem = require('./profileMenuItem');

// Creating user schema
const ApplicationSettingSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    name:String ,
    title:String ,
    folder: String,
    temp_name:String ,
    google_map: Boolean,
    menu_type:String ,
    theme:String ,
    redirect_url:String ,
    varify_mode:String ,
    teamname:Boolean,
    bucket: String,
    keys:{
        type:Map,
        of:{
            type:Map,
            of:String
        }
    } ,
    appCardMasterDataSize: Number,
    profileMenuItemList:[ProfileMenuItem] ,
    commonModuleList:[String]  ,
    defaultApplicationSettings: DefaultApplicationSettings,
    authenticationSettings: AuthenticationSettings,
    roundValueNoOfDigits: Number,
    totalGridData: Number,
    mobileAppSettings:MobileAppSettings,
    
});


// Combine the base entity schema with the user schema
const ApplicationSetting =  mongoose.model('ApplicationSetting', ApplicationSettingSchema,'app_application_setting');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = ApplicationSetting;