const Operators = require("../../enum/operator");
const CollectionHandler = require("../collectionHandler");
const QueryCriteria = require("../queryHandler/queryCriteria");
const cacheService =  require("./../../cache/cacheService");

const collectionHandler = new CollectionHandler();

class HtmlTemplateHandler {
    constructor() {

    }
    prepareHtmlStringReponse(value, htmlObject, emailTemplate, template, object, fileName){

    }
    async getDefaultTemplate(value, object, emailTemplate){
        let pojo = cacheService.getPojoFromCollection(value);
        if(pojo && pojo.templateName){
            let templateName = pojo.templateName;
            let template = "";
            let queryCriteriaList = [];
            if(object && object['print_template']){
                templateName = object['print_template']
            }

            queryCriteriaList.push(new QueryCriteria("refCode","string",Operators.EQUAL,object.refCode));
		    queryCriteriaList.push(new QueryCriteria("type","string",Operators.EQUAL,templateName));

            emailTemplate = await collectionHandler.findFirstDocumentWithListQueryCriteria(await cacheService.getModel("email_template"),queryCriteriaList);
        }
        return emailTemplate;
    }
}

module.exports = HtmlTemplateHandler;