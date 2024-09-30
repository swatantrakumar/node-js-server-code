const AlertType = require("../enum/alertType");
const EmailTemplate = require("../model/generic/emailTemplate");
const CollectionHandler = require("./collectionHandler");
const cacheService = require('./../cache/cacheService');

const collectionHandler = new CollectionHandler();

class EmailTemplateHandler{
    async generateNotificationUsingTemplate(templateName, emailList, textToAppendedToBody){
        let emailTemplate = await this.getTemplate(templateName);
        let alert = {};
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
        this.handleSendMail(alert,SYSTEM_EMAIL);
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
    handleSendMail(alert, applicationUserEmail, extraParameters){
        try{
            alert.createdDate = new Date();
            alert.createdBy = applicationUserEmail;            
            console.log("Email is sending via direct notifier");
            // if(alert.getAlertAttachmentList() != null && !alert.getAlertAttachmentList().isEmpty()){
            //     attachmentHandler.handleAlertAttachement(alert);
            // }
            // return collectionHandler.insertDocument(alert,notifierDb);            
        }catch (e){
            console.error("Error while send mail " + e.message);
        }
        return null;
    }
}
module.exports = EmailTemplateHandler;