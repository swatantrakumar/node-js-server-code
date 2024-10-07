const nunjucks = require('nunjucks');
const CollectionHandler = require('../handler/collectionHandler');
const EmailTemplate = require('../model/generic/emailTemplate');
const Operators = require('../enum/operator');

nunjucks.configure({ autoescape: true });

const collectionHandler = new CollectionHandler();

class NunjucksService {
    constructor() {

    }
    addTemplateBodyToStringBuffer(template, emailTemplate) {
        // Check if emailTemplate has a valid body
        if (emailTemplate.body && emailTemplate.body.toLowerCase() !== 'null') {
            // Append the body to the template buffer
            template += emailTemplate.body;
        } else {
            // Append a fallback message if the body is null or 'null'
            template += "TEMPLATE IS NOT MAPPED";
        }
        
        return template;
    }    
    getIncludedTemplateBill = async (incomingTemplate) => {
        try {
            // Clone the incoming template string
            let template = '' + incomingTemplate;
    
            // Use regex to match patterns between square brackets (e.g., [INCLUDE_TEMPLATE:X])
            const pattern = /\[(.*?)\]/g;
            let listMatches = [];
            let match;
    
            // Extract all matches into listMatches (group(2) equivalent in Java)
            while ((match = pattern.exec(template)) !== null) {
                listMatches.push(match[1]); // Extract text inside the square brackets
            }
    
            // Get templates based on the matched INCLUDE_TEMPLATE values
            const templateList = await this.getTemplatesFromINCLUDEText(listMatches);
    
            // Iterate through templateList and replace placeholders with actual body content
            if (templateList && templateList.length > 0) {
                templateList.forEach(htmlTemplate => {
                    incomingTemplate = incomingTemplate.replace(`[INCLUDE_TEMPLATE:${htmlTemplate.type}]`, htmlTemplate.body);
                });
            }
        } catch (e) {
            console.error(e); // Handle error
        }
    
        return incomingTemplate;
    };
    getTemplatesFromINCLUDEText = async (templateStrings) => {
        if (templateStrings && templateStrings.length > 0) {
            // Strip 'INCLUDE_TEMPLATE:' from each string in the array
            const templateNames = templateStrings.map(str => str.replace('INCLUDE_TEMPLATE:', ''));
    
            // Query MongoDB to find documents where 'type' matches any of the templateNames
            let crList = [];
            crList.push(new QueryCriteria("type","string",Operators.IN, templateNames));
            let templates = await collectionHandler.findAllDocuments(EmailTemplate, "body type", crList);
    
            return templates;
        } else {
            return null;
        }
    };
}

module.exports = NunjucksService;