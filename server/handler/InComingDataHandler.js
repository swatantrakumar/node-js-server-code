const cacheService  = require('../cache/cacheService');
const CommonUtils = require('../utils/commonUtils');
const Config = require('../enum/config');


const commonUtil = new CommonUtils();

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
    saveOrUpdateMasterObject(result, coll, jsonObject){
        if (coll) {
            let clazz = null;
            try {
                clazz = cacheService.getModel(coll);
            } catch (e) {
                console.log("Unable to Find Class against incoming object {}", coll);
            }
            try {
                this.enrichOjectAndSave(result, coll, jsonObject, clazz);
            }catch (e){
                result.set("error" , e.message);
            }
        }
    }
    enrichOjectAndSave(result, coll, jsonObject, clazz){
        populateDefaultRefCode(jsonObject);
        let key = null;
        let data;
        if (!isDuplicate(clazz, coll, jsonObject, result)) {
            switch (coll) {
                case "admin_forms":
                case "admin_columns":
                case "admin_fields":
                    key =  updateSerialEnrichObjectAndSave(clazz, coll, jsonObject);
                    break;
                case "holiday_calendar":
                    key =  updateSerialEnrichObjectAndSave(clazz, coll, jsonObject);
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
                        if (jsonObject.has(AccountField.ACCOUNT_STATUS.name)) accountStatus = jsonObject.getString(AccountField.ACCOUNT_STATUS.name);
                        if (jsonObject.has(AccountField.TWO_FACTOR_AUTHENTICATION.name)) twoFactorAuthentication = jsonObject.getBoolean(AccountField.TWO_FACTOR_AUTHENTICATION.name);
                        if (accountStatus != null) updateMap.put(AccountField.ACCOUNT_STATUS.name,accountStatus);
                        updateMap.put(AccountStatus.ENABLED.value, enabledStatus);
                        updateMap.put(AccountField.TWO_FACTOR_AUTHENTICATION.name,twoFactorAuthentication);
                        const crlIst = [];
                        crlIst.push(new QueryCriteria("_id", Operator.EQUAL, jsonObject.getString("_id")));
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
                    key = updateSerialEnrichObjectAndSave(clazz, coll, jsonObject);
                    break;
            }
            if (key != null) {
                data = collectionHandler.findDocumentById(clazz, key.get_id());
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
}

module.exports = InComingDataHandler;