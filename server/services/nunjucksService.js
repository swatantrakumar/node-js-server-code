const nunjucks = require('nunjucks');
const CollectionHandler = require('../handler/collectionHandler');
const EmailTemplate = require('../model/generic/emailTemplate');
const Operators = require('../enum/operator');
const CommonUtils = require('../utils/commonUtils');
const AttachmentHandler = require('../handler/attachmentHandler');
const SeriesHandler = require('../handler/seriesHandler');
const NumberUtility = require('../utils/numberUtility');
const JsonHandler = require('../handler/jsonHandler');
const QueryCriteria = require('../handler/queryHandler/queryCriteria');
const NunjucksWriter = require('./nunjucksWriter');

nunjucks.configure({ autoescape: true });

const collectionHandler = new CollectionHandler();
const commonUtil = new CommonUtils();
const attachmentHandler = new AttachmentHandler();
const seriesHandler = new SeriesHandler();
const numberUtility = new NumberUtility();
const jsonHandler = new JsonHandler();
const nunjucksWriter = new NunjucksWriter();

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
    async getConvertedObjectFromFreeMarkerReportingTemplate(emailTemplate, object) {
        let incomingObject = {};
    
        // Check if mapping_name exists and is not empty
        if (emailTemplate.mapping_name && emailTemplate.mapping_name.trim() !== '') {
            // Call getMappedData, assuming it's a function similar to your Java logic
            incomingObject = await this.getMappedData(object, emailTemplate.mapping_name, false);
        } else {
            // If no mapping_name, simply use the object directly
            incomingObject = { ...object };  // Spread operator to copy the object
        }
    
        try {
            // Check if refCode exists in the incomingObject
            if (incomingObject.refCode) {
                console.log("updating refCode in Template Body and Event Text");
    
                // Replace [REFCODE] in the body and events_text
                if (emailTemplate.body) {
                    emailTemplate.body = emailTemplate.body.replace("[REFCODE]", incomingObject.refCode.toString());
                }
    
                if (emailTemplate.events_text) {
                    emailTemplate.events_text = emailTemplate.events_text.replace("[REFCODE]", incomingObject.refCode.toString());
                }
            }
        } catch (error) {
            console.log(`Error while setting refCode in Template: ${error.message}`);
        }
    
        return incomingObject;
    }
    async getMappedData(object, templateName, isJsonObject) {
        
        const reportTemplates = await collectionHandler.findDocument('FreeMarkerReportTemplates', 'templateName', templateName);
        
        try {
            let jsonObject;
    
           
            if (isJsonObject) {
                jsonObject = object;
            } else {
                jsonObject = JSON.parse(JSON.stringify(object)); 
            }
    
            const map = {};
            const columnMap = {};
    
            
            await this.getMap(reportTemplates.columnList, jsonObject, map, columnMap);
    
            return map;
        } catch (error) {
            console.error(`Error processing JSON object: ${error.message}`);
        }
    
        return null;
    }
    async getMap(columnListList, jsonObject, map, columnMap) {
        const incomingObject = JSON.parse(JSON.stringify(jsonObject));
        Object.assign(map, incomingObject);  
        await this.getHashMapFromJsonObjectAsPerTemplate(columnListList, jsonObject, map, columnMap);
    }
    async getHashMapFromJsonObjectAsPerTemplate(columnListList, jsonObject, map, columnMap) {
        columnListList.forEach(async columnList => {
            await this.getHashMapFromJsonObjectAsPerTemplatePerColumnListElement(columnList, jsonObject, map, columnMap);
        });
    
        await this.prepareTemplateColumns(columnListList, map, columnMap);  // Assuming this is a helper function
    }
    async prepareTemplateColumns(columnListList, map, columnMap) {
        // Filter template columns
        const templateColumns = columnListList.filter(column => column.columnType.toLowerCase() === 'template');
    
        if (templateColumns && templateColumns.length > 0) {
            const templateCols = {};
            const templateTypes = [];
    
            // Populate the templateCols map and templateTypes array
            templateColumns.forEach(columnList => {
                templateTypes.push(columnList.columnValue);
                templateCols[columnList.columnValue] = columnList;
            });
    
            let queryCriteriaList = [];
            queryCriteriaList.push(new QueryCriteria("type","string",Operators.IN,templateTypes));
            // Fetch all templates based on the templateTypes
            const templates = await collectionHandler.findAllDocumentsWithListQueryCriteria(EmailTemplate,queryCriteriaList);
    
            // Process each email template
            templates.forEach(emailTemplate => {
                let template = '';
    
                if (emailTemplate) {
                    template = emailTemplate.body;
                }
    
                // Generate the HTML content using the freemarkerTemplateWriter
                const htmlString = nunjucksWriter.getHtmlContentForObject(map, template);
    
                // Set the value in the corresponding template column
                const columnValue = emailTemplate.type;
                templateCols[columnValue].value = htmlString;
    
                // Update the map and columnMap with the generated HTML content
                map[templateCols[columnValue].columnName] = htmlString;
                columnMap[templateCols[columnValue].columnName] = templateCols[columnValue];
            });
        }
    }
    async getHashMapFromJsonObjectAsPerTemplatePerColumnListElement(columnList, jsonObject, map, columnMap) {
        if (!columnList.columnType || columnList.columnType.toLowerCase() !== 'template') {
            const col = JSON.parse(JSON.stringify(columnList));  
    
            console.log(`Processing for ${columnList.columnName} / ${columnList.columnValue}`);
    
            if (columnList.defaultValue && !columnList.columnValue) {
                this.defaultvalueColumnType(map, columnList, columnList.defaultValue);
            } else {
                if (!columnList.columnValue) {
                    this.defaultvalueColumnType(map, columnList, 'Json Path Not Found');
                } else {
                    let columnType = columnList.columnType ? columnList.columnType.toLowerCase() : 'string';
                    let value = null;
    
                    try {
                        if (columnList.columnValue.trim() !== '') {
                            value = commonUtil.getValueFromJSONObjectFromAnyLevel(jsonObject, columnList.columnValue); 
                        } else {
                            console.log('Error while getting value');
                        }
                    } catch (error) {
                        console.log(`Error while fetching value for ${columnList.columnName} / ${columnList.columnType}`);
                        value = this.getDefaultValueForType(columnType);
                    }
    
                    await this.handleColumnType(columnType, columnList, map, columnMap, col, jsonObject, value);
                }
            }
        }
    }
    defaultvalueColumnType(map, columnList, columnListValue) {
        map[columnList.columnName] = columnListValue;
    }
    getDefaultValueForType(columnType) {
        switch (columnType) {
            case 'image':
                return [];
            case 'boolean':
                return false;
            default:
                return '';
        }
    }
    async handleColumnType(columnType, columnList, map, columnMap, col, jsonObject, value) {
        switch (columnType) {
            case 'image':
                await this.imageColumnType(columnList, map, columnMap, col, value);
                break;
            case 'imagebytes':
                await this.imagebyteColumnType(columnList, map, columnMap, col, value);
                break;
            case 'date':
                this.dateColumnType(columnList, map, columnMap, col, value);
                break;
            case 'listofobject':
                await this.listofobjectColumnType(columnList, jsonObject, map, columnMap);
                break;
            case 'mapofobject':
                this.mapofobjectColumnType(columnList, jsonObject, map, columnMap);
                break;
            case 'patternoffields':
                this.patternoffieldsColumnType(columnList, jsonObject, map);
                break;
            case 'amountinwords':
                this.amountinwordsColumnType(columnList, map, value);
                break;
            case 'defaultvalue':
                this.defaultvalueColumnType(map, columnList, columnList.defaultValue || columnList.columnValue);
                break;
            case 'stringlist_from_array':
                this.stringlistFromArrayColumnType(columnList, jsonObject, map, columnMap, col);
                break;
            case 'object':
                this.objectColumnType(map, columnList, value, col, columnMap);
                break;
            case 'conditional':
                this.conditional(map, columnList, value, col, columnMap, jsonObject);
                break;
            case 'string':
            default:
                this.stringOrDefaultColumnType(columnList, map, columnMap, col, value);
        }
    }
    async imageColumnType(columnList, obj, columnObj, col, value) {
        try {
            if (Array.isArray(value)) {
                const images = [];
                for (const file of value) {
                    const key = file.key;
                    const byteArray = await attachmentHandler.getByteArrayFromS3ObjectKey(key);
                    const base64Encoded = Buffer.from(byteArray).toString('base64');
                    const imgAsBase64 = `data:image/png;base64,${base64Encoded}`;
                    images.push(imgAsBase64);
                }
                this.objectColumnType(obj, columnList, images, col, columnObj);
            }
        } catch (e) {
            console.error(e);
            obj[columnList.columnName] = [];
        }
    }
    async imagebyteColumnType(columnList, obj, columnObj, col, value) {
        try {
            if (Array.isArray(value)) {
                const images = [];
                for (const file of value) {
                    const key = file.key;
                    const byteArray = await attachmentHandler.getByteArrayFromS3ObjectKey(key);
                    const base64Encoded = Buffer.from(byteArray).toString('base64');
                    images.push(base64Encoded);
                }
                this.objectColumnType(obj, columnList, images, col, columnObj);
            }
        } catch (e) {
            console.error(e);
            obj[columnList.columnName] = [];
        }
    }
    dateColumnType(columnList, obj, columnObj, col, value) {
        if (value !== null) {
            let objectDate = null;
            try {
                if (typeof value === 'number') {
                    objectDate = new Date(value);
                }
            } catch (e) {
                console.log("Error while parsing date", value);
            }
            
            let dateFormat = commonUtil.getDateFormat(value.toString());
            if (!objectDate && columnList.source_format) {
                dateFormat = columnList.source_format;
            }
            
            try {
                if (!objectDate && dateFormat) {
                    objectDate = commonUtil.changeStringDateToSpecificFormat(value.toString(), dateFormat);
                }
                if (objectDate) {
                    value = commonUtil.convertDateToString(objectDate, columnList.format);
                    this.objectColumnType(obj, columnList, value, col, columnObj);
                } else {
                    console.error("Object date is null", columnList.columnName, columnList.columnType, value);
                }
            } catch (e) {
                console.log("Error while parsing date", e.message);
            }
        }
    }
    async listofobjectColumnType(columnList, jsonObject, obj, columnObj) {
        const childList = columnList.columnList;
        const targetField = [];
        obj[columnList.columnName] = targetField;
    
        if (jsonObject[columnList.columnValue]) {
            const fieldValueList = jsonObject[columnList.columnValue];
            for (const fieldObject of fieldValueList) {
                const childMap = {};
                await this.getMap(childList, fieldObject, childMap, columnObj);
                targetField.push(childMap);
            }
        }
    }
    async mapofobjectColumnType(columnList, jsonObject, obj, columnObj) {
        const childList = columnList.columnList;
        const targetField = {};
        
        for (const columnItem of childList) {
            try {
                await this.getHashMapFromJsonObjectAsPerTemplatePerColumnListElement(columnItem, jsonObject, targetField, columnObj);
            } catch (e) {
                console.error("Error while parsing value", e.message);
                targetField[columnItem.columnName] = null;
            }
        }
        
        obj[columnList.columnName] = targetField;
    }
    patternoffieldsColumnType(columnList, jsonObject, obj) {
        try {
            obj[columnList.columnName] = seriesHandler.getConvertedString(jsonObject, columnList.columnValue);
        } catch (e) {
            console.error("Error while parsing value", e.message);
            obj[columnList.columnName] = null;
        }
    }
    amountinwordsColumnType(columnList, obj, value) {
        try {
            if (value) {
                const amountInWords = numberUtility.getAmountInWords(Math.round(commonUtil.getDecimalAmount(value.toString())));
                this.defaultvalueColumnType(obj, columnList, amountInWords);
            }
        } catch (e) {
            console.error("Error while parsing value", e.message);
            obj[columnList.columnName] = null;
        }
    }
    stringlistFromArrayColumnType(columnList, jsonObject, obj, columnObj, col) {
        try {
            const format = columnList.format;
            const fields = columnList.columnValue.split(":");
            const retrievedArray = jsonHandler.getUniqueList(jsonObject[fields[0]], fields[1]);
            const valueList = JSON.parse(retrievedArray);
    
            let value;
            if (format && format === "comma_separated") {
                value = commonUtil.getStringFromListOfString(valueList, ", ");
            } else {
                value = valueList;
            }
    
            this.objectColumnType(obj, columnList, value, col, columnObj);
        } catch (e) {
            console.error("Error while fetching listofstring_from_array", e.message);
        }
    }
    conditional(obj, columnList, value, col, columnObj, jsonObject) {
        const conditions = columnList.conditions || [];
        let returnValueFound = false;
    
        for (const condition of conditions) {
            if (returnValueFound) break;
    
            const crList = condition.crList || [];
            let conditionCheck = true;
    
            for (const criteria of crList) {
                const field = criteria.field;
                const values = criteria.value;
                const valueType = criteria.valueType;
                const operator = criteria.operator;
    
                try {
                    const objectValue = commonUtil.getValueFromJSONObjectFromAnyLevel(jsonObject, field).toString();
                    let comparingValue = null;
    
                    if (valueType === "STATIC") {
                        comparingValue = values.toString();
                    } else {
                        comparingValue = commonUtil.getValueFromJSONObjectFromAnyLevel(jsonObject, values.toString()).toString();
                    }
    
                    if (operator === "EQUAL" && objectValue !== comparingValue) {
                        conditionCheck = false;
                        break;
                    }
                } catch (e) {
                    console.error(e);
                    conditionCheck = false;
                }
            }
    
            if (conditionCheck) {
                returnValueFound = true;
                if (condition.returnValueType === "STATIC") {
                    obj[columnList.columnName] = condition.returnValue;
                } else {
                    obj[columnList.columnName] = commonUtil.getValueFromJSONObjectFromAnyLevel(jsonObject, condition.returnValue.toString());
                }
            } else if (condition.elseReturnValue) {
                returnValueFound = true;
                if (condition.elseReturnValue === "STATIC") {
                    obj[columnList.columnName] = condition.elseReturnValue;
                } else {
                    obj[columnList.columnName] = commonUtil.getValueFromJSONObjectFromAnyLevel(jsonObject, condition.elseReturnValue.toString());
                }
            }
        }
    }
    stringOrDefaultColumnType(columnList, obj, columnObj, col, value) {
        if (value === null) {
            this.objectColumnType(obj, columnList, "", col, columnObj);
        } else if (Array.isArray(value)) {
            const objectList = value.map(item => {
                return typeof item === 'string' ? item : JSON.parse(item);
            });
            this.objectColumnType(obj, columnList, objectList, col, columnObj);
        } else if (typeof value === 'object') {
            this.objectColumnType(obj, columnList, JSON.parse(JSON.stringify(value)), col, columnObj);
        } else {
            this.objectColumnType(obj, columnList, value, col, columnObj);
        }
    }
    objectColumnType(obj, columnList, value, col, columnObj) {
        obj[columnList.columnName] = value;
        col.value = value;
        columnObj[columnList.columnName] = col;
    }
}

module.exports = NunjucksService;