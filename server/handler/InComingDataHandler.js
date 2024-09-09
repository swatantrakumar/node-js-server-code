const {ObjectId} = require('mongodb');
const cacheService  = require('../cache/cacheService');
const CommonUtils = require('../utils/commonUtils');
const Config = require('../enum/config');
const ObjectKeyHandler = require('./objectHandler');
const CollectionHandler = require('./collectionHandler');
const SeriesHandler = require('./seriesHandler');
const FreemarkerTemplateWriter = require('./freeMarker/freemarkerTemplateWriter');
const EmailTemplate = require('../model/generic/emailTemplate');
const AttachmentHandler = require('./attachmentHandler');


const commonUtil = new CommonUtils();
const objectKeyHandler = new ObjectKeyHandler();
const collectionHandler = new CollectionHandler();
const seriesHandler = new SeriesHandler();
const freemarkerTemplateWriter = new FreemarkerTemplateWriter();
const attachmentHandler = new AttachmentHandler();

class InComingDataHandler {
    updateCreatorUpdaterInfoInJson(result, jsonObject, user){
        try {
            if(user){
                if(cacheService.getActiveUserJSONMap().get(user.email.toLowerCase())) jsonObject.set("requesting_user",cacheService.getActiveUserJSONMap().get(user.email.toLowerCase()));
                if (!jsonObject.hasOwnProperty("createdBy")) {
                    jsonObject.createdBy = user.email;
                    jsonObject.createdByName = user.name;
                    jsonObject.createdDate = commonUtil.getJsonAcceptableDate(new Date());
                    jsonObject.status = (jsonObject.status === null ? "Active" : jsonObject.status);
                } else {
                    jsonObject.updatedBy =  user.email;
                    jsonObject.updatedByName = user.name;
                    jsonObject.updateDate = commonUtil.getJsonAcceptableDate(new Date());
                }
                if (jsonObject.refCode == null || jsonObject.refCode == "") {
                    if(user.refCode){
                        jsonObject.refCode = user.refCode;
                    }else{
                        jsonObject.refCode = Config.DEFAULT_REFCODE;
                    }
                }
            } else {
                result.set("error", "Unable to authenticate requesting user, Access Denied !!!");
                return true;
            }
        } catch (e) {
            console.error(e.stack());
        }
        return false;
    }
    async saveOrUpdateMasterObject(result, coll, jsonObject){
        if (coll) {
            let clazz = null;
            try {
                clazz = await cacheService.getModel(coll);
            } catch (e) {
                console.log("Unable to Find Class against incoming object {}", coll);
            }
            try {
                await this.enrichOjectAndSave(result, coll, jsonObject, clazz);
            }catch (e){
                result.set("error" , e.message);
            }
        }
    }
    populateDefaultRefCode(object){
        try {
            if (!object?.refCode) {
                object.refCode = Config.DEFAULT_REFCODE;
            }

        } catch (e) {
            object.put("refCode", Config.DEFAULT_REFCODE);
        }
    }
    async enrichOjectAndSave(result, coll, jsonObject, clazz){
        this.populateDefaultRefCode(jsonObject);
        let key = null;
        let data;
        if (!await this.isDuplicate(clazz, coll, jsonObject, result)) {
            switch (coll) {               
                case "holiday_calendar":
                    key =  await this.updateSerialEnrichObjectAndSave(clazz, coll, jsonObject);
                    staticDataCache.prepareHolidayCalendar();
                    break;
                case "compare_modules":
                     key = moveModules(coll, jsonObject, clazz,"compare",false);
                    break;
                case "move_modules":
                    key = moveModules(coll, jsonObject, clazz,"direct",false);
                    break;
                case "compare_env_modules":
                    key = moveModules(coll, jsonObject, clazz,"compare",true);
                    break;
                case "move_env_modules":
                    key = moveModules(coll, jsonObject, clazz,"direct",true);
                    break;
                case "user_status":
                    try{
                        const updateMap = new Map();
                        const enabledStatus = false;
                        const accountStatus = null;
                        const twoFactorAuthentication = false;

                        if (jsonObject.has(AccountStatus.ENABLED.value)) enabledStatus = jsonObject.getBoolean(AccountStatus.ENABLED.value);
                        if (jsonObject.has(AccountField.ACCOUNT_STATUS.name)) accountStatus = jsonObject[AccountField.ACCOUNT_STATUS.name];
                        if (jsonObject.has(AccountField.TWO_FACTOR_AUTHENTICATION.name)) twoFactorAuthentication = jsonObject.getBoolean(AccountField.TWO_FACTOR_AUTHENTICATION.name);
                        if (accountStatus != null) updateMap.put(AccountField.ACCOUNT_STATUS.name,accountStatus);
                        updateMap.put(AccountStatus.ENABLED.value, enabledStatus);
                        updateMap.put(AccountField.TWO_FACTOR_AUTHENTICATION.name,twoFactorAuthentication);
                        const crlIst = [];
                        crlIst.push(new QueryCriteria("_id", Operator.EQUAL, jsonObject._id));
                        collectionHandler.upsert(AppUser.class, crlIst, updateMap);
                        result.set("success", "success");
                    }catch (e){
                        console.log("Error while update status of user");
                        result.set("error","Error while update status of user");
                    }

                    break;
                case "schedule_event":
                    const externalSystemConnections = null;
                    externalSystemConnections = serverCallHandler.getExternalSystemConnections("SchedulerAccountCreateSchedule");
                    if(externalSystemConnections != null){
                        const authUser = serverCallHandler.getAuthResponse("SchedulerAccountSignIn");
                        const token = "";
                        if (!authUser.getToken().isEmpty()) {
                            token = authUser.getToken();
                            const respEntity = restTemplateUtility.getObjectResponseEntity(gson.fromJson(jsonObject.toString(), Object.class), restTemplateUtility.createBearerRequest(token), externalSystemConnections.getHostname() + externalSystemConnections.getEndPoint());
                            result.set("data", respEntity.getBody());
                        }
                        result.set("success", "success");
                    }else{
                        key = updateSerialEnrichObjectAndSave(clazz, coll, jsonObject);
                    }
                    break;
                case "lead_contact_bhu":
                    if (jsonObject.has("query_detail")) {
                        commonUtil.removeKeysFromJsonObject(jsonObject, Arrays.asList("updateDate", "createdDate"));
                        const leadContact = gson.fromJson(jsonObject.toString(), LeadContact.class);
                        const newJsonObject = new JSONObject(gson.toJson(leadContact));
                        key = updateSerialEnrichObjectAndSave(clazz, coll, newJsonObject);
                    }else{
                        key = updateSerialEnrichObjectAndSave(clazz, coll, jsonObject);
                    }
                    break;
                default:
                    key = await this.updateSerialEnrichObjectAndSave(clazz, coll, jsonObject);
                    break;
            }
            if (key && key._id) {
                data = await collectionHandler.findDocumentById(clazz, key._id);
                result.set("success", "success");
                result.set("data", data);
                sendWhatsAppNotification(coll, jsonObject, clazz);
            } else {
                result.set("error", "error occurred");
            }
        } else {
            result.set("error", "duplicate error !!!");
        }
    }
    async isDuplicate(clazz, collection, incomingObject, result) {
        try {            
            const primaryKeys = cacheService.getPrimaryKeysForPojo(collection);
            if (primaryKeys && primaryKeys.length > 0) {
                const queryCriteriaList = objectKeyHandler.getUniqueKeyQuery(collection, incomingObject);
                const persistedObject = await collectionHandler.findFirstDocumentWithListQueryCriteria(clazz, queryCriteriaList);
                if (persistedObject) {                    
                    const jsonObject = JSON.parse(JSON.stringify(persistedString));
                    const prevVersion = 0;
                    try {
                        if (jsonObject.version) {
                            prevVersion = jsonObject.version;
                        }
                    } catch (e) {
                        console.log("Error while getting previous version ");
                    }
                    if (incomingObject._id) {
                        if (jsonObject._id != incomingObject._id) {
                            result.set("persisted", persistedObject);
                            return true;
                        } else {
                            incomingObject.version = ++prevVersion;
                            result.set("persisted", persistedObject);
                            return false;
                        }
                    } else {
                        result.set("persisted", persistedObject);
                        return true;
                    }
                }
            }
        } catch (e) {
            console.error(e.stack);
        }
        return false;
    }
    async updateSerialEnrichObjectAndSave(clazz, coll, jsonObject){        
        await seriesHandler.populate_series(coll, jsonObject, null, null);    /// done
        await this.inDataEnricher(coll, jsonObject);
        this.updateAltNameInObject(jsonObject);
        if (!jsonObject._id) {
            jsonObject._id =  new ObjectId().toString();
        }
        try {
            await attachmentHandler.handleAssociatedFile(coll, jsonObject, null);
        } catch (e) {
            console.log("Error while saving attachment {}", e.message);
        }        
        return collectionHandler.insertDocumentWithLog(clazz,jsonObject,JSON.parse(JSON.stringify(jsonObject)));
    }
    inDataEnricher = async (col, jsonObject) => {
        switch (col.toLowerCase()) {            
            case "pojo_master":
                if (jsonObject.class_fields) {
                    try {
                        const template = await this.getTemplate("POJO_GENERATOR");
                        jsonObject.code_string = await freemarkerTemplateWriter.getHtmlContentForObject(JSON.parse(JSON.stringify(jsonObject)), template);

                    } catch (e) {
                        console.log("Error while generating code string {}", e.message);
                    }
                }
                break;
        }
    }
    getTemplate = async (templateName) => {
        let template = '';
        
        try {
            const emailTemplate = await collectionHandler.findDocument(EmailTemplate,"type",templateName);
    
            if (emailTemplate) {
                template = emailTemplate.body;
            }
        } catch (error) {
            console.error('Error fetching email template:', error);
        }
    
        return template;
    };
    updateAltNameInObject(object) {
        try {
            if (object.name) {
                object.altname = commonUtil.getTrimmedString(object.name.toString());
                if(object.altname == ""){
                    object.altname = object.name;
                }
            }

        } catch (e) {
            console.error(e.stack);
        }
    }
}

module.exports = InComingDataHandler;