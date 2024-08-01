const mongoose = require('mongoose');

const AuthenticationSettings = mongoose.Schema({
    adminEmailId:String,
    allowedInactiveNumberOfDays:{ type: Number, default: 60},
    passwordAutoResetNumberOfDays:{ type: Number, default: 90},
    passwordAutoResetNotificationNumberOfDays:{ type: Number, default: 60},
    wrongLoginAttempt:{ type: Number, default: 3},
    accountLockTimeInHours:{ type: Number, default: 24},
    twoFactorAuthentication:Boolean,
    twoFactorAuthenticationType:{ type:String,default:'email'}
});

module.exports = AuthenticationSettings;