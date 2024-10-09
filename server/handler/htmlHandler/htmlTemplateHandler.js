const commonConstant = require("../../enum/commonConstant");
const Operators = require("../../enum/operator");
const ClientConfiguration = require("../../model/generic/clientConfiguration");
const ClientsPdfEvents = require("../../model/generic/pdf/clientsPdfEvents");
const SpecialCharacter = require("../../model/generic/pdf/specialCharacter");
const NunjucksService = require("../../services/nunjucksService");
const CommonUtils = require("../../utils/commonUtils");
const CollectionHandler = require("../collectionHandler");
const QueryCriteria = require("../queryHandler/queryCriteria");
const cacheService =  require("./../../cache/cacheService");
const HtmlToPdf = require("./htmlToPdf");
const PdfEventHandler = require("./PdfEventHandler");
const PdfProperties = require("./pdfProperties");

const collectionHandler = new CollectionHandler();
const nunjucksService = new NunjucksService();
const pdfEventHandler = new PdfEventHandler();
const htmlToPdf = new HtmlToPdf();
const commonutil = new CommonUtils();

class HtmlTemplateHandler {
    constructor() {

    }
    async prepareHtmlStringReponse(value, htmlObject, emailTemplate, template, object, fileName){
        if (object) {
            let objectMap = commonutil.getReference(object);
            fileName = objectMap?.code.toString();
        }
        if (commonutil.getTrimmedString(fileName) == null) {
            let objectMap = commonutil.getReference(object);
            fileName = objectMap?.code.toString();
            if (objectMap?.name) {
                fileName = fileName + "_" + objectMap?.name.toString();
            }
        }
        fileName = fileName + ".pdf";
        try {
            let preparedObject = JSON.parse(JSON.stringify(object));
            let branch =  await collectionHandler.findDocument(Branches, "refCode", preparedObject?.refCode.toString());
            let config =  await collectionHandler.findDocument(ClientConfiguration, "refCode", preparedObject?.refCode.toString());
            if (branch) preparedObject.MY_BRANCH =  branch;
            if (config) preparedObject.MY_CONFIG =  config;
            object = preparedObject;
        } catch (error) {
            console.error(error.stack);
        }
        let covertedObject = nunjucksService.getConvertedObjectFromFreeMarkerReportingTemplate(emailTemplate, object);

        //// form this check next
        try {
            let pdfFileNameObject = staticDataCache.getPDFName(object.refCode.toString(), value);
            if(pdfFileNameObject){
                fileName = seriesHandler.getConvertedString(object,pdfFileNameObject.toString()) + ".pdf";
            }
        }catch (e){
            console.log("Error while fetching file name for pdf {}" + e.message);
        }
        let html_String = freemarkerTemplateWriter.getHtmlContentForObject(covertedObject, template);
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
    async getPdfBytesArray(htmlObject){
        let html_String = htmlObject?.html_String
        if(html_String && html_String.includes("null") && html_String.includes("<body>")){
            html_String = html_String.replace(/null/g, "");
        }
        let specialCharacterList = await collectionHandler.findAllDocuments(SpecialCharacter,'',[new QueryCriteria("status","string",Operators.NOT_EQUAL,"Inactive")]);
        if (specialCharacterList && Array.isArray(specialCharacterList) && specialCharacterList.length > 0){
            for (let specialCharacter of specialCharacterList){
                let specialCharacterRegex = new RegExp(specialCharacter.specialCharacter, 'g');
                html_String = html_String.replace(specialCharacterRegex, specialCharacter.specialCharacterCode);
            }
        }
        let object = htmlObject?.object;
        let emailTemplate = htmlObject?.emailTemplate;
        let page_size = emailTemplate && emailTemplate.page_size  ? emailTemplate.page_size : "A4";
        let htmlBuffer = "";
        htmlBuffer += html_String.replace(/<br>/g, "<br/>");
        let bytes = null;
        try {
            let pdfEvents = null;
            if (htmlObject[commonConstant.CLIENTS_PDF_EVENTS]) {
                pdfEvents = await this.getClientPdfEvents(object.refCode.toString(),htmlObject[commonConstant.CLIENTS_PDF_EVENTS]);
            }

            if (emailTemplate.events_text && emailTemplate.events_text.trim() !== '') {
                if (emailTemplate.events_text.includes('INCLUDE_TEMPLATE')) {
                    emailTemplate.events_text = nunjucksService.getIncludedTemplateBill(emailTemplate.events_text);
                }
            
                // Parse the events_text into an array of PdfEvent objects
                let pdfEvents1 = JSON.parse(emailTemplate.events_text); 
                
                // Check and merge pdfEvents if provided
                if (pdfEvents) {
                    if (!pdfEvents1 || pdfEvents1.length === 0) {
                        pdfEvents1 = pdfEvents;
                    } else {
                        pdfEvents1 = [...pdfEvents1, ...pdfEvents]; 
                    }
                }
            
                // Populate PDF event values
                await pdfEventHandler.populatePdfEventsValues(pdfEvents1, object);
            
                // Generate the PDF
                const bytes = htmlToPdf.createAnySizePdfFromHtmlDynamicMultipleHeaderFooters(
                    htmlBuffer.toString(),
                    pdfEvents1,
                    new PdfProperties(page_size)
                );
            }

        } catch (error) {
            console.log(error.stack);
        }
        return bytes;
    }
    async getClientPdfEvents(refCode, keys){
        try {
            let crList = [];
            crList.push(new QueryCriteria("refCode","string",Operators.EQUAL, refCode));
            crList.push(new QueryCriteria("key","string", Operators.IN, keys));
            let clientsPdfEvents = await collectionHandler.findAllDocumentsWithListQueryCriteria(ClientsPdfEvents, crList);

           if(clientsPdfEvents){
               let pdfEvents= [];
               clientsPdfEvents.forEach(clientsPdfEvents1 => {
                   pdfEvents.push(clientsPdfEvents1.pdfEvent);
               });
               return pdfEvents;
           }
        }catch (e){
            console.log("Error while fetching ClientsPDFEvent {}",e.message);
        }
        return null;
    }
}

module.exports = HtmlTemplateHandler;