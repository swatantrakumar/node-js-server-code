const CommonUtils = require("../../utils/commonUtils");
const templateHandler = require("../templateHandler");

const commonUtils = new CommonUtils();

class RetrievalQueryHandler{
    processCoreSobjCall(employee, orderBy, kvp){
        const result = null;
        const refCode = kvp.key;
        const appId = kvp.key2;
        const caseId = kvp.key3;
        const colName = kvp.value;
        const log = kvp.log;
        const pageSize = kvp.pageSize == 0 ? 50 : kvp.pageSize;
        const pageNumber = kvp.pageNo;
        const criteriaList = [];
        const clazz = null;
        try {
            clazz = this.reportHandler.getClass(colName);
        } catch (error) {
            logger.info("Error while fetching class by colName {}", colName);
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
        const isCentralApplication = false;
        const centralizedModule = null;

        if(kvp.module && colName) {
            centralizedModule = cacheService.getApplicationProperties(CENTRAL_PREFIX+"_"+kvp.module +"_" + colName);
            const iamCentral = cacheService.getApplicationProperties(IS_CENTRAL_APPLICATION);
            isCentralApplication = iamCentral == null ? false : (iamCentral.equalsIgnoreCase(YES) ? true : false);
            if(!isCentralApplication && centralizedModule && centralizedModule === 'YES' ){
                // return serverCallHandler.commonPostToExternalServer(CENTRAL_USER, API_SOBJ , kvp);
            }
        }

        /** END - >  set flag if Call has to be thorugh Central Server ***/

        if(clazz) {
            enrichQueryWithDefaultCriteria(employee,colName,criteriaList,kvp);
            reportHandler.enrichQuery( colName, kvp, criteriaList );
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
                        templateList = queryHandler.asList(clazz, criteriaList, effectiveOrderBy, pageNumber, pageSize);
                    }
                    if (kvp.module && kvp.module == "MYFAV" && (templateList == null || templateList.length > 0)) {
                        // templateList = this.getTemplateFromCentralData(criteriaList);
                    }
                    objList = [];
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
                                    if (fevouriteTemplateTabIdSet.has(tab._id)) {
                                    tab['favourite'] = true; // Equivalent to a.setFavourite(true)
                                    return tab;
                                    }
                                })
                                .filter(Boolean); // Filter out undefined entries (i.e., those not in the favourite set)

                                // Set the filtered and updated tabs back to template1
                                template1.templateTabs = updatedTabs;                                
                                objList.push(template1);
                            } else if ( templateTabSet && templateTabSet.length > 0 && template &&  template.templateTabs && template.templateTabs.length >= 1 && template.tabs && template.tabs.length >= 1) {
                                template1.tabs = template1.tabs.filter(tab => templateTabSet.has(tab._id));
                                // Iterate over the templateTabs to set isFavourite to true and then filter
                                const updatedTabs = template1.templateTabs
                                .map(tab => {
                                    if (fevouriteTemplateTabIdSet.has(tab._id)) {
                                        tab['favourite'] = true; // Equivalent to a.setFavourite(true)                                    
                                    }
                                    if(templateTabSet.includes(tab._id)){
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
                        e.printStackTrace();
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
                    result = queryHandler.asList(clazz,criteriaList,effectiveOrderBy, pageNumber, pageSize);
            }
            console.log("Query Execute for /sobj " + criteriaList.toString());
        }
        return result;
    }
}
module.exports = RetrievalQueryHandler;