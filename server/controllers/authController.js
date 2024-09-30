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
            let user = await User.findOne({ email: body.userId });
            if (user === null) {
                return res.status(400).send({
                    message: "User not found."
                });
            }else {
                if (user.validPassword(body.password)) {
                    const payload = {email : user.email};
                    // Generate JWT token
                    const token = jwt.sign(payload, secretKey.key, { expiresIn: '24h' });

                    // Return token to client
                    return res.status(200).send({token : token });
                }else {
                    return res.status(400).send({
                        message: "Wrong Password"
                    });
                }
            }
        } catch (error) {
            console.log("login error");
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
        if(authMode == 'email'){
            if(!isUserEnabled){
                await this.sendVerificationEmail(appUser,isAdmin, signUpRequest.domain, "Email_Verification");
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
                res.status(500).send({
                    message: "Some error occurred while generating OTP"
                });
            }
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
    static async updateAppUser(model){
        const filter = { _id: model._id };  // or any other unique field
        const update = { $set: model };  // the fields to update
        const options = { upsert: true, new: true };  // upsert inserts if not found, new returns the updated doc
        result = await model.findOneAndUpdate(filter, update, options);  
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
                const url =  `${baseUrl}/${appUser.verificationCode}/${appUser.email}`
                await emailTemplateHandler.generateNotificationUsingTemplate("USER_NEW_ACCOUNT_TEMPLATE_JWT",
                        emailList, url);
            } else if (emailType == "Forgot_Password") {
                emailTemplateHandler.generateNotificationUsingTemplate("USER_NEW_ACCOUNT_TEMPLATE",
                        emailList, baseUrl.concat(appUser.passwordResetCode));
            }else if (emailType == "Authentication_Code") {
                emailTemplateHandler.generateNotificationUsingTemplate("TWO_FACTOR_AUTHENTICATION_TEMPLATE",
                        emailList, baseUrl.concat(appUser.authenticationCode));
            }
        }
    }
}

module.exports = AuthController;