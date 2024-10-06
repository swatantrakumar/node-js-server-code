
const cacheService = require('./../../cache/cacheService');
const HtmlTemplateHandler = require("./htmlTemplateHandler");
const HtmlHandler = require("./htmlHandler");
const NunjucksService = require("../../services/nunjucksService");
const CollectionHandler = require('../collectionHandler');


const htmlTemplateHandler = new HtmlTemplateHandler();
const collectionHandler = new CollectionHandler();
const htmlHandler = new HtmlHandler();
const nunjucksService = new NunjucksService();

class ApplicationHtmlHandler {
    constructor() {
        
    }
    async getHtmlForObject(_id, kvp, result){
        try {        
            let htmlObject = {}; 
            let template = "";
            let object = {};
            let fileName = "";
            let emailTemplate = {};
            let value =  kvp?.value;
            switch (value.toLowerCase()) {                
                default:
                    try {
                        object = await collectionHandler.findDocumentById(await cacheService.getModel(value), _id);
                        emailTemplate = await htmlHandler.getTemplate(value, JSON.parse(JSON.stringify(object)));
                        nunjucksService.addTemplateBodyToStringBuffer(template, emailTemplate);
                    } catch (e) {
                        console.log("Error while fetching the email template {}", e.message);
                    }
                    break;
            }
            let html_String = htmlTemplateHandler.prepareHtmlStringReponse(value, htmlObject, emailTemplate, template, object, fileName);
            result.put( "success", html_String);
        } catch (error) {
             console.log(e.stack);   
        }
        return htmlObject;
    }
}
module.exports = ApplicationHtmlHandler;