const NunjucksService = require("../../services/nunjucksService");
const HtmlTemplateHandler = require("./htmlTemplateHandler");

const nunjucksService = new NunjucksService();
const htmlTemplateHandler = new HtmlTemplateHandler();

class HtmlHandler {
    constructor() {
        
    }
    async getTemplate(value, object){
        let emailTemplate = {};
        if(value){
            switch (value.toLowerCase()) {
                
                default:
                    emailTemplate = await htmlTemplateHandler.getDefaultTemplate(value, object, emailTemplate);
                    break;
            }
        }
        emailTemplate.body = nunjucksService.getIncludedTemplateBill(emailTemplate?.body);
        return emailTemplate;
    }
}
module.exports = HtmlHandler;