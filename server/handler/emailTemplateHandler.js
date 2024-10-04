const AlertType = require("../enum/alertType");
const EmailTemplate = require("../model/generic/emailTemplate");
const CollectionHandler = require("./collectionHandler");
const cacheService = require('./../cache/cacheService');
const commonConstant = require("../enum/commonConstant");
const Alerts = require("../model/alerts/alerts");
const Config = require("../enum/config");
const AttachmentHandler = require("./attachmentHandler");

const collectionHandler = new CollectionHandler();
const attachmentHandler = new AttachmentHandler();

class EmailTemplateHandler{
    async generateNotificationUsingTemplate(templateName, emailList, textToAppendedToBody){
        let emailTemplate = await this.getTemplate(templateName);
        let alert = new Alerts();
        alert.unsubscribeLink = await cacheService.getApplicationProperties("DOMAIN_URL");
        alert.title = emailTemplate.title ? emailTemplate.title : "Email Title";
        alert.emailFromMailId = emailTemplate.from;
        alert.emailFromName = emailTemplate.emailFromName ? emailTemplate.emailFromName : "Email From";
        alert.bccEmail = emailTemplate.bccEmail ? emailTemplate.bccEmail : "";
        alert.ccEmail = emailTemplate.ccEmail ? emailTemplate.ccEmail : "";
        alert.emailList = emailList && Array.isArray(emailList) && emailList.length > 0 ? emailList : null;
        alert.message = emailTemplate.body + textToAppendedToBody;
        alert.contentType = emailTemplate.contentType ? emailTemplate.contentType : "text/html";
        alert.sendToAll = true;
        let alertTypes = [];
        alertTypes.push(AlertType.EMAIL);
        alert.typeList = alertTypes;
        alert.deliveryDate = new Date();
        alert.status = "PENDING";
        await this.handleSendMail(alert,commonConstant.SYSTEM_EMAIL);
    }
    async getTemplate(templateName){  
        let emailTemplate = null;
        try {
            emailTemplate = await collectionHandler.findDocument(EmailTemplate , "type" , templateName );
            if(emailTemplate){
                return emailTemplate;
            }
        } catch (error) {
            console.error(error.stack);
        }
        return emailTemplate;
    }
    async handleSendMail(alert, applicationUserEmail, extraParameters){
        try{
            alert.createdDate = new Date();
            alert.createdBy = applicationUserEmail;            
            console.log("Email is sending via direct notifier");
            // if(alert.alertAttachmentList && Array.isArray(alert.alertAttachmentList) && alert.alertAttachmentList.length > 0){
            //     attachmentHandler.handleAlertAttachement(alert);
            // }
            return await collectionHandler.insertDocument(alert,Config.NOTIFIER_DB);            
        }catch (e){
            console.error("Error while send mail " + e.message);
        }
        return null;
    }
}
module.exports = EmailTemplateHandler;