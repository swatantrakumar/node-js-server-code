const mongoose = require('mongoose');

const MobileAppSettings = mongoose.Schema({
    appCardMasterDataSize:{type:Number,default:200},
    readBarCodeImageFromDevice:Boolean
});

module.exports = MobileAppSettings;