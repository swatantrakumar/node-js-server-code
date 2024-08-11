const CommonUtils = require("../../utils/commonUtils");
const CollectionHandler = require("../collectionHandler");
const templateHandler = require("../templateHandler");
const QueryHandler = require("./queryHandler");
const cacheService = require('../../cache/cacheService');
const PermissionHandler = require("../permissionHandler");

const commonUtils = new CommonUtils();
const queryHandler = new QueryHandler()
const collectionHandler = new CollectionHandler();
const permissionHandler = new PermissionHandler();

class RetrievalQueryHandler{
    async processApplicationSobjCall(employee, orderBy, kvp){
        let result = null;
        const refCode = kvp.key;
        const appId = kvp.key2;
        const caseId = kvp.key3;
        const colName = kvp.value;
        const log = kvp.log;
        const pageSize = kvp.pageSize == 0 ? 50 : kvp.pageSize;
        const pageNumber = kvp.pageNo ? kvp.pageNo : 1;
        let criteriaList = [];
        let templateList = [];
        let clazz = null;
        try {
            clazz = await commonUtils.getModel(colName);
        } catch (error) {
            console.log("Error while fetching class by colName {}", colName);
        }
        if (clazz == null) {
            console.log("Getting Query for " + colName + " failed");
        }
        let effectiveOrderBy = null;
        if (orderBy) {
            effectiveOrderBy = orderBy;
        } else {
            effectiveOrderBy = "-createdDate,-updateDate";
        }

        /**** set flag if Call has to be thorugh Central Server ***/
        // const isCentralApplication = false;
        // const centralizedModule = null;

        // if(kvp.module && colName) {
        //     centralizedModule = cacheService.getApplicationProperties(CENTRAL_PREFIX+"_"+kvp.module +"_" + colName);
        //     const iamCentral = cacheService.getApplicationProperties(IS_CENTRAL_APPLICATION);
        //     isCentralApplication = iamCentral == null ? false : (iamCentral.equalsIgnoreCase(YES) ? true : false);
        //     if(!isCentralApplication && centralizedModule && centralizedModule === 'YES' ){
        //         // return serverCallHandler.commonPostToExternalServer(CENTRAL_USER, API_SOBJ , kvp);
        //     }
        // }

        /** END - >  set flag if Call has to be thorugh Central Server ***/

        if(clazz) {
            // enrichQueryWithDefaultCriteria(employee,colName,criteriaList,kvp);
            queryHandler.enrichQuery( colName, kvp, criteriaList );
            switch (colName) {
//                case "menu":
//                        criteriaList.add(new QueryCriteria("appId", "string", Operator.EQUAL, appId));
//                        result = queryHandler.asList(clazz, criteriaList, effectiveOrderBy, pageNumber, pageSize);
//                    break;
                // case "menu_template":
                //     List<Object> templateList = queryHandler.asList(clazz, criteriaList,effectiveOrderBy, pageNumber, pageSize);
                //     List<Object> objList = new ArrayList<>();
                //     try {
                //         JSONArray array = new JSONArray(gson.toJson(templateList));
                //         for (int i = 0; i < array.length(); i++) {
                //             objList.add(templateHandler.templateIdMap.get(array.getJSONObject(i).getString("_id")));
                //         }
                //     } catch (Exception e) {
                //         e.printStackTrace();
                //     }
                //     result = objList;
                //     break;
                case "form_template":
                    if(kvp.module && templateHandler.getCoreModuleList().includes(kvp.module)){
                        // templateList = this.getTemplateFromCentralData(criteriaList);
                    } else {
                        templateList = await collectionHandler.findAllDocumentsWithListQueryCriteria(clazz, criteriaList, effectiveOrderBy, pageNumber, pageSize);
                        
                    }
                    if (kvp.module && kvp.module == "MYFAV" && (templateList == null || templateList.length > 0)) {
                        // templateList = this.getTemplateFromCentralData(criteriaList);
                    }
                    let objList = [];
                    try {
                        const array = commonUtils.cloneObject(templateList);
                        for (let i = 0; i < array.length; i++) {
                            const templateJson = array[i];
                            const key = (templateJson.appId ? templateJson.appId : null) + "_" + templateJson.name;
                            const template = templateHandler.getTemplate(key);
                            const template1 =  commonUtils.cloneObject(template);
                            if (template1 && employee) {
                                // getUserPreferenceData(template1, employee, kvp);
                            }
                            const templateTabSet = permissionHandler.getTemplateTabIdSet(employee);
                            const fevouriteTemplateTabIdSet = permissionHandler.getFevouriteTemplateTabIdSet(employee);
                            if (kvp && kvp.module && kvp.module == "MYFAV" && template.templateTabs != null && template.emplateTabs.length >= 1 && template.tabs && template.tabs.length >= 1 && fevouriteTemplateTabIdSet.length > 0) {
                                template1.tabs = template1.tabs.filter(tab => fevouriteTemplateTabIdSet.has(tab._id));
                                // Iterate over the templateTabs to set isFavourite to true and then filter
                                const updatedTabs = template1.templateTabs
                                .map(tab => {
                                    if (fevouriteTemplateTabIdSet && fevouriteTemplateTabIdSet.has(tab._id)) {
                                    tab['favourite'] = true; // Equivalent to a.setFavourite(true)
                                    return tab;
                                    }
                                })
                                .filter(Boolean); // Filter out undefined entries (i.e., those not in the favourite set)

                                // Set the filtered and updated tabs back to template1
                                template1.templateTabs = updatedTabs;                                
                                objList.push(template1);
                            } else if ( templateTabSet && templateTabSet.size > 0 && template &&  template.templateTabs && template.templateTabs.length >= 1 && template.tabs && template.tabs.length >= 1) {
                                template1.tabs = template1.tabs.filter(tab => templateTabSet.has(tab._id));
                                // Iterate over the templateTabs to set isFavourite to true and then filter
                                const updatedTabs = template1.templateTabs
                                .map(tab => {
                                    if (fevouriteTemplateTabIdSet && fevouriteTemplateTabIdSet.has(tab._id)) {
                                        tab['favourite'] = true; // Equivalent to a.setFavourite(true)                                    
                                    }
                                    if(templateTabSet.has(tab._id)){
                                        return tab;
                                    }
                                }); // Filter out undefined entries (i.e., those not in the favourite set)

                                // Set the filtered and updated tabs back to template1
                                template1.templateTabs = updatedTabs;
                                objList.push(template1);
                            } else {
                                objList.push(template1);
                            }
                        }
                    } catch (e) {
                        console.log("Query Execute for /sobj " + e.message);
                    }
                    result = objList;
                    break;
                // case "form":
                // case "forms":
                //     List<Object> forms = queryHandler.asList(clazz, criteriaList,effectiveOrderBy, pageNumber, pageSize);
                //     objList = new ArrayList<>();
                //     try {
                //         JSONArray array = new JSONArray(gson.toJson(forms));
                //         for (int i = 0; i < array.length(); i++) {
                //             JSONObject templateJson = array.getJSONObject(i);
                //             objList.add(templateHandler.getFormMap().get(templateJson.getString("_id")));
                //         }
                //     } catch (Exception e) {
                //         e.printStackTrace();
                //     }
                //     result = objList;
                //     break;
                // case "additional_master" :
                //     if(criteriaList != null && criteriaList.size() > 0 && kvp != null && StringUtils.isNotBlank(kvp.getModule()) && templateHandler.getCoreModuleList().contains(kvp.getModule())) {
                //         String type = criteriaList.get(criteriaList.size()-1).getValue().toString();
                //         result = templateHandler.getAdditionalMasterListFromCentral(type);
                //     } else {
                //         result = queryHandler.asList(clazz,criteriaList,effectiveOrderBy, pageNumber, pageSize);
                //         if ((result == null || result.isEmpty()) && criteriaList.size() > 0) {
                //             result = templateHandler.getAdditionalMasterListFromCentral(criteriaList.get(criteriaList.size()-1).getValue().toString());
                //         }
                //     }
                //     break;
                default:                     
                     result = await collectionHandler.findAllDocumentsWithListQueryCriteria(clazz, criteriaList, effectiveOrderBy, pageNumber, pageSize);
                     break;
            }
            console.log("Query Execute for /sobj " + criteriaList.toString());
        }
        return result;
    }
    getDefaultSortByString(value) {
        const sortBy = "name";
        if (cacheService.getPojoFromCollection(value) && cacheService.getPojoFromCollection(value)?.defaultSortBy) {
            sortBy = cacheService.getPojoFromCollection(value)?.defaultSortBy;
        }
        return sortBy;
    }
    async processCoreMasterGridDataCall(employees, response_result, kvp, orderBy, colName){
        const pageSize = kvp.pageSize == 0 ? 50 : kvp.gageSize;
        const pageNumber = kvp.pageNo ? kvp.pageNo : 1;
        const criteriaList = [];
        let clazz=null;
        try {
            clazz = await commonUtils.getModel(colName);
        }catch (e){
            console.log("Error while fetching class by colName {}", colName);
        }
        if(clazz==null){
            console.log("Getting Query for " + colName + " failed");
        }else {
            // enrichQueryWithDefaultCriteria(employees, colName, criteriaList,kvp);
            if (!orderBy) {
                orderBy="-updateDate,-createdDate";
            }
            switch (colName){                
                case "alert_notification":
                    response_result.set('data', [])
                    response_result.set('dataSize', 0)
                    break;
                default:
                    await this.enrichQueryAndGetResult(clazz,kvp, response_result, colName,orderBy, pageSize, pageNumber, criteriaList );
            }
            console.log("Query Executed for /gd for {} : {}", colName, criteriaList.toString());
        }
        
    }
    async enrichQueryAndGetResult(clazz, kvp, response_result, colName, orderBy, pageSize, pageNumber, criteriaList) {
        let result;
        queryHandler.enrichQuery(colName, kvp, criteriaList);

        let templateTab = templateHandler.getTabNameMap().get(kvp.tab);
        let grid = templateTab && templateTab.grid ? templateTab.grid : null;
        let dbName = grid && grid?.dbName ? grid.dbName : null;
        let count = dbName ? await collectionHandler.count(clazz, criteriaList,dbName) : await collectionHandler.count(clazz, criteriaList);
        if(kvp.countOnly){
            response_result.set("data_size",count);
            response_result.set("data", null);
        }else {
            response_result.set("data_size", count);
            result = await collectionHandler.findAllDocumentsWithListQueryCriteria(clazz, criteriaList, orderBy, pageNumber, pageSize);            
            response_result.set("data", result);
        }
    }
}
module.exports = RetrievalQueryHandler;