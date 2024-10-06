const nunjucks = require('nunjucks');

nunjucks.configure({ autoescape: true });

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
            // Create a copy of the incoming template
            let template = `${incomingTemplate}`;
            
            // Regular expression to find patterns like [INCLUDE_TEMPLATE:templateType]
            const pattern = /\[INCLUDE_TEMPLATE:(.*?)\]/g;
            
            // Find all matches for [INCLUDE_TEMPLATE] patterns
            let listMatches = [...template.matchAll(pattern)].map(match => match[1]);
    
            // Get the list of EmailTemplate objects from the matches
            const templateList = await getTemplatesFromINCLUDEText(listMatches);
    
            // If templates are found, replace each placeholder with the template body
            if (templateList) {
                templateList.forEach((emailTemplate) => {
                    const placeholder = `[INCLUDE_TEMPLATE:${emailTemplate.type}]`;
                    incomingTemplate = incomingTemplate.replace(placeholder, emailTemplate.body);
                });
            }
        } catch (err) {
            console.error("Error in getIncludedTemplateBill:", err);
        }
    
        return incomingTemplate;
    };
}

module.exports = NunjucksService;