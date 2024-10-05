const jwt = require('jsonwebtoken');
const secretKey  = require('../utils/jwtUtils');
const crypto = require('crypto');
// Importing User Schema
const User = require('../model/auth/user');
const CommonUtils = require('../utils/commonUtils');
const Config = require('../enum/config');
const CollectionHandler = require('../handler/collectionHandler');
const ApplicationUser = require('../model/permission/applicationUser');
const Operators = require('../enum/operator');
const InComingDataHandler = require('../handler/InComingDataHandler');
const ApplicationSetting = require('../model/generic/applicationSetting');
const EmailTemplateHandler = require('../handler/emailTemplateHandler');
const AccountStatus = require('../enum/accountStatus');


const commonUtils = new CommonUtils();
const collectionHandler = new CollectionHandler();
const inComingDataHandler = new InComingDataHandler();
const emailTemplateHandler = new EmailTemplateHandler();
const authMode = Config.AUTH.MODE;
const isUserEnabled = Config.AUTH.USER.ENABLED;
const sendmail = Config.AUTH.SEND_MAIL;

class AuthController {

    static login = async (req, res) =>  {
        const body = commonUtils.decodeBase64(req.body);        
        try {
            let applicationSettings = await collectionHandler.findAllDocuments(ApplicationSetting);
            let applicationSetting = applicationSettings[0];
            let user = await User.findOne({ email: body.userId });
            if (user) {                
                if(user.enabled){
                    if (user.validPassword(body.password)) {
                        let twoFactoreAuthentication = applicationSetting?.authenticationSettings?.twoFactorAuthentication;
                        if(twoFactoreAuthentication){
                            if(appUser.disableTwoFactorAuthentication){
                                twoFactoreAuthentication = false;
                            }
                        }
                        if(twoFactoreAuthentication){
                            return handleTwoFactorAuthenticationResponse(user);
                        }else {
                            let responce = await this.handleSigninResponse(this.createJwtToken({ email: body.userId }), this.handleSignin(user, applicationSetting), user);                            
                            return res.status(200).send(responce);
                        }
                    }else {
                        let responce = await this.badCredentialHandle(user,applicationSetting);
                        return res.status(400).send(responce);                        
                    }
                }else{
                    return res.status(400).send({
                        message: "User has not been verified."
                    });
                }
            }else {
                return res.status(400).send({
                    message: "User not Registered."
                });
            }
        } catch (error) {
            console.log("login error" + error);
        }       
    }    
    static signUp = async (req, res) => {
        const signUpRequest = commonUtils.decodeBase64(req.body);

        let isAdmin = false;
        if(signUpRequest.admin){
            isAdmin = signUpRequest.admin;
        }
        let appUser = null;

        if (await this.userExists(signUpRequest.userId.toLowerCase())) {
            if(authMode && authMode == 'email'){
                return res.status(400).send({message: "This Email is already registerd."});
            }else{
                return res.status(400).send({message: "This Phone Number is already registerd."});
            }
        }
        const verificationCode = crypto.randomBytes(32).toString('hex');

        // Creating empty user object
        let newUser = new User();
    
        // Initialize newUser object with request data    
        newUser.createdBy = signUpRequest.email;
        newUser.createdByName = signUpRequest.name;
        newUser.name = signUpRequest.name;
        newUser.email = signUpRequest.email;
        newUser.mobileNumber = signUpRequest.mobileNumber;
        newUser.enabled = isUserEnabled;
        newUser.user = signUpRequest.userId;
        newUser.accountStatus = "Active"
        newUser.verificationCode = verificationCode;
        
    
        // Call setPassword function to hash password
        newUser.setPassword(signUpRequest.password); 
        // Save newUser object to database
        try {
            appUser = await this.createAppUser(newUser);
        } catch (error) {
            console.error(error.stack);
            return res.status(400).send({
                message: "Failed to add user."
            });           
        }
        let persistedUser = null;
        try {
            if(authMode == 'email'){
                if(!isUserEnabled){
                    try {
                        await this.sendVerificationEmail(appUser,isAdmin, signUpRequest.domain, "Email_Verification");
                    } catch (error) {
                        return res.status(500).send({
                            message: "Some error occurred while Sending Mail."
                        });
                    }                    
                }
                persistedUser = await collectionHandler.findDocument(ApplicationUser,'email',signUpRequest.email,Operators.EQUAL);
            }else{
                let otp = twoFactorUtility.sendSmsAutoGenOtp(appUser.mobileNumber);
                // == If we get status as success then fetch the session id and store it in DB for that user
                if (otp.get("Status") == "Success") {
                    appUser.verificationCode = otp.get("Details");
                    await this.updateAppUser(appUser);
                    persistedUser = await collectionHandler.findDocument(ApplicationUser,
                            "mobile1", signUpRequest.mobileNumber,Operators.EQUAL_IGNORE_CASE);
                } else {
                    return res.status(500).send({
                        message: "Some error occurred while generating OTP"
                    });
                }
            }
        } catch (error) {
            return res.status(500).send({
                message: "Some error occurred while sending mail or generating OTP."
            });    
        }
        if(persistedUser == null){
            let userObj = {};
            userObj.name =  signUpRequest.name;
            userObj.email =  signUpRequest.email.toLowerCase();
            userObj.mobile1 =  signUpRequest.mobileNumber;   
            await inComingDataHandler.saveOrUpdateMasterObject(new Map(), "user", userObj);
        }
        return res.status(200).send({message : "User registered successfully"});        
    }
    static forgetPassword = async (req, res) => {
        const fpRequest = commonUtils.decodeBase64(req.body);
        let user = null;
        try {
            user = await User.findOne({ email: fpRequest.userId });
            if (user) {
                if (user.enabled) {
                    if (authMode == "email") {
                        user.passwordResetCode = this.randomNumeric(8);
                        user.resetCodeGenerateTime = commonUtils.getCurrentDate();
                        await this.updateAppUser(user);
                        await this.sendVerificationEmail(user,fpRequest.admin, "Your verification code is ", "Forgot_Password");
                    } else {
                        // implement otp forget password flow
                        // let otp =  twoFactorUtility.sendSmsAutoGenOtp(user.mobileNumber);
                        let otp = null;
                        if (otp && otp.get("Status") == "Success") {
                            user.passwordResetCode = otp.get("Details");
                            user.resetCodeGenerateTime = commonUtils.getCurrentDate();
                            await this.updateAppUser(user);
                        } else {                            
                            return res.status(500).send({
                                message: "Some error occurred while generating OTP"
                            });
                        }
                    }                    
                    return res.status(200).send({
                        message: "Reset password is successful, " +
                            "notification with a verification code has been sent to your registered user id"
                    });
                } else {
                    return res.status(400).send({
                        message: "User has not been enabled yet."
                    });
                }
            } else {
                return res.status(400).send({
                    message: "User not found."
                });
            }
        } catch (error) {
            return res.status(400).send({
                message: "User not Registered."
            });
        }
    }
    static resetPassword = async (req, res) => {
        const resetPasswordRequest = commonUtils.decodeBase64(req.body);
        let user = null;
        try {
            user = await User.findOne({ email: resetPasswordRequest.userId });
            if (user) {
                let code = resetPasswordRequest.code;
                let newPassword = resetPasswordRequest.newPassword;
                if (authMode == "email") {
                    if(code == user.passwordResetCode){
                        // Call setPassword function to hash password
                        user.setPassword(newPassword);
                        user.lastPasswordResetDate = commonUtils.getCurrentDate();
                        user.passwordResetCode = "";
                        await this.updateAppUser(user);
                        return res.status(200).send({
                            message: "Reset password is successful"
                        });
                    }else{
                        return res.status(400).send({
                            message: "Verification code is invalid"
                        });
                    }                    
                } else {
                    // let otp =  twoFactorUtility.verifySmsOtp(user.passwordResetCode, code);
                    let opt = null;
                    if (opt && otp.get("Status") == "Success") {
                        user.setPassword(newPassword);
                        user.lastPasswordResetDate = commonUtils.getCurrentDate();
                        user.passwordResetCode = "";
                        await this.updateAppUser(user);
                        return res.status(200).send({
                            message: "Reset password is successful"
                        });
                    } else {
                        return res.status(400).send({
                            message: "Verification code is invalid"
                        });
                    }
                }                  
            } else {
                return res.status(400).send({
                    message: "User not found."
                });
            }
        } catch (error) {
            return res.status(400).send({
                message: "User not Registered."
            });
        }
    }
    static changePassword = async (req,res) => {
        const changePasswordRequest = commonUtils.decodeBase64(req.body);
        let oldPassword = changePasswordRequest.currentPassword;
        let newPassword = changePasswordRequest.newPassword
        const userId = req.user.email;
        let user = null;
        try {
            user = await User.findOne({ email: userId });
            if (user) {
                if(user.validPassword(newPassword)){
                    return res.status(400).send({
                        message: "New Password and Old Password can not be same."
                    });
                }else if (user.validPassword(oldPassword)){
                    user.setPassword(newPassword);
                    user.lastPasswordResetDate = commonUtils.getCurrentDate();
                    await this.updateAppUser(user);
                    return res.status(200).send({
                        message: "Your Password has been updates successfully"
                    });
                }else{
                    return res.status(400).send({
                        message: "Incorrect Current Password."
                    });                    
                }            
            }else{
                return res.status(400).send({
                    message: "User not found."
                });
            }
        } catch (error) {
            return res.status(400).send({
                message: "User not Registered."
            });
        }
    }
    static async handleSigninResponse(token,message,appUser){
        appUser.lastLoginTime = commonUtils.getCurrentDate();
        await this.updateAppUser(appUser);
        let responce = {}
        if (appUser.accountStatus && appUser.accountStatus.toLowerCase() == "locked") {
            responce = {message: message};
        } else if (message) {
            responce = {token:token,message: message};
        } else {
            if (appUser.wrongLoginAttempt && appUser.wrongLoginAttempt > 0) {
                appUser.wrongLoginAttempt = 0;
                appUser.wrongLoginAttemptTime = null;
                this.updateAppUser(appUser);
            }
            responce = {token:token};
        }
        return responce;
    }
    static handleSignin(appUser, applicationSetting) {
        let lastPasswordResetDate = appUser.lastPasswordResetDate;
        let lastLoginDate = appUser.lastLoginTime;
        let accountStatus = appUser.accountStatus;
        let authenticationSetting = applicationSetting.authenticationSettings;
        let lastLoginDays = authenticationSetting.allowedInactiveNumberOfDays;
        let resetDays = authenticationSetting.passwordAutoResetNumberOfDays;
        let resetNotifyDays = authenticationSetting.passwordAutoResetNotificationNumberOfDays;
        let applicationWrongLoginLockHour = authenticationSetting.accountLockTimeInHours;

        let loginDays;
        if(lastLoginDate != null){
            loginDays = commonUtils.calculateDateDifferenceInDays(lastLoginDate);
        }else{
            loginDays = 1;
        }
        let days = commonUtils.calculateDateDifferenceInDays(lastPasswordResetDate);
        let message ="";

        if(accountStatus && accountStatus.toLowerCase() == "locked"){
            message = this.handleLockedAccount(appUser,applicationWrongLoginLockHour);
        }else if(loginDays > lastLoginDays){
            message = this.handleLastLogin(appUser);
        }else if(days > resetNotifyDays && days < resetDays){
            message = "notify";
        }
        else if (days >= resetDays) {
            message = "reset";
        }
        return  message;
    }
    static handleLockedAccount(){
        let lockTime = appUser.lockTime;
        if(lockTime){
            let accountLockTimeInHours = commonUtils.calculateDateDifferenceInHours(lockTime);
            if(accountLockTimeInHours >= hour){
                appUser.accountStatus = AccountStatus.ACTIVE;
                appUser.lockTime = null;
                return "";
            }
        }
        return "Your Account is Locked, Connect to Admin!!!";
    }
    static handleLastLogin(){
        let message="";
        appUser.accountStatus = AccountStatus.LOCKED;
        appUser.lockTime = null;
        message = "Your Account is Locked, Connect to Admin!!!";
        return message;
    }
    static createJwtToken(payload) {
        // Generate JWT token
        const token = jwt.sign(payload, secretKey.key, { expiresIn: '24h' });
        return token;
    }
    static async userExists(userId){        
        const emailExists = await User.findOne({ email: userId});
        return emailExists;
    }
    static async createAppUser(newUser){
        // Save newUser object to database
        try {
            const user = await newUser.save();
            console.log("User added successfully.");
            return user;
        } catch (err) {
            console.error("Error adding user:", err);
            throw err;
        }
    }
    static async updateAppUser(object){
        const filter = { _id: object._id };  // or any other unique field
        const update = { $set: object };  // the fields to update
        const options = { upsert: true, new: true };  // upsert inserts if not found, new returns the updated doc
        let model = await collectionHandler.getModelForNewDb(object,'');
        let result = await model.findOneAndUpdate(filter, update, options);
    }
    static async sendVerificationEmail(appUser, admin, baseUrl, emailType) {
        if(sendmail) {
            let applicationSettings = null;
            let emailList = [];
            emailList.push(appUser.email);
            if(admin){
                applicationSettings =  await collectionHandler.findAllDocuments(ApplicationSetting)[0];
                if(applicationSettings && applicationSettings.authenticationSettings && applicationSettings.authenticationSettings.adminEmailId){
                    emailList.push(applicationSettings.authenticationSettings.adminEmailId);
                }
            }
            if (emailType == "Email_Verification") {
                const url =  `${baseUrl}/${appUser.verificationCode}/${appUser.email}`;
                await emailTemplateHandler.generateNotificationUsingTemplate("USER_NEW_ACCOUNT_TEMPLATE_JWT",
                        emailList, url);
            } else if (emailType == "Forgot_Password") {
                const url =  `${baseUrl}/${appUser.passwordResetCode}`
                await emailTemplateHandler.generateNotificationUsingTemplate("USER_NEW_ACCOUNT_TEMPLATE",
                        emailList, url);
            }else if (emailType == "Authentication_Code") {
                const url =  `${baseUrl}/${appUser.authenticationCode}`
                await emailTemplateHandler.generateNotificationUsingTemplate("TWO_FACTOR_AUTHENTICATION_TEMPLATE",
                        emailList, url);
            }
        }
    }
    static async badCredentialHandle(appUser,applicationSetting){
        let msg = "Password Entered is not correct";
        let wrongLoginAttemptTime = appUser.wrongLoginAttemptTime;
        let wrongLoginAttempt = appUser.wrongLoginAttempt;
        let loginAttempt = applicationSetting.authenticationSettings.wrongLoginAttempt;
        let accountLockTimeInHours = applicationSetting.authenticationSettings.accountLockTimeInHours;
        if(wrongLoginAttempt == null){
            wrongLoginAttempt = 0;
        }
        let hour = 1;
        if(wrongLoginAttemptTime != null && wrongLoginAttempt >= loginAttempt){
            hour = commonUtils.calculateDateDifferenceInHours(wrongLoginAttemptTime);
            if(hour >= accountLockTimeInHours){
                appUser.wrongLoginAttempt = 0;
            }
        }
        if(wrongLoginAttempt >= loginAttempt){
            if(appUser.accountStatus && appUser.accountStatus.toLowerCase() != "locked") {
                appUser.accountStatus = AccountStatus.LOCKED;
                appUser.lockTime = commonUtils.getCurrentDate();
                msg = "Your Account Locked for "+accountLockTimeInHours+" Hour!!!";
            }
        }else{
            appUser.wrongLoginAttempt = wrongLoginAttempt + 1;
            appUser.wrongLoginAttemptTime = commonUtils.getCurrentDate();
        }
        await this.updateAppUser(appUser);
        return { message: msg,wrongLoginAttempt:appUser.wrongLoginAttempt};
    }
    static randomNumeric(length) {
        let result = '';
    
        while (result.length < length) {
            // Generate a random byte, convert it to a number and append it to the result
            const randomByte = crypto.randomBytes(1).toString('hex');
            
            // Ensure it's a numeric character
            const digit = parseInt(randomByte, 16) % 10;
            result += digit;
        }

        return result;
    }
}

module.exports = AuthController;