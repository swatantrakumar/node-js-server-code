const CommonUtils = require("../../utils/commonUtils");
const CollectionHandler = require("../collectionHandler");
const templateHandler = require("../templateHandler");
const QueryHandler = require("./queryHandler");
const cacheService = require('../../cache/cacheService');
const PermissionHandler = require("../permissionHandler");
const SearchCriteria = require("./searchCriteria");
const QueryCriteria = require("./queryCriteria");
const Operators = require("../../enum/operator");
const coreMethodHandler = require("../coreMethodHandler");

const commonUtils = new CommonUtils();
const queryHandler = new QueryHandler();
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
            clazz = await cacheService.getModel(colName);
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
            this.enrichQueryWithDefaultCriteria(employee,colName,criteriaList,kvp);
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
                //             objList.add(templateHandler.templateIdMap.get(array.getJSONObject(i)._id));
                //         }
                //     } catch (e) {
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
                //             objList.add(templateHandler.getFormMap().get(templateJson._id));
                //         }
                //     } catch (e) {
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
        let sortBy = "name";
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
            clazz = await cacheService.getModel(colName);
        }catch (e){
            console.log("Error while fetching class by colName {}", colName);
        }
        if(clazz==null){
            console.log("Getting Query for " + colName + " failed");
        }else {
            this.enrichQueryWithDefaultCriteria(employees, colName, criteriaList,kvp);
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
    async getCountWithQueryCriteria(employees,kvp){
        const criteriaList = [];
        const colName = kvp.value;
        let count  = 0;
        let clazz = null;
        try {
            clazz = await cacheService.getModel(colName);
            this.enrichQueryWithDefaultCriteria(employees, colName, criteriaList,kvp);
            queryHandler.enrichQuery(colName, kvp, criteriaList);
            count =  await collectionHandler.count(clazz, criteriaList);
        } catch (error) {
            console.log("Error while fetching class by colName {}", colName);
        }  
        return count;      
    }
    async getStaticDataResultForCoreMasters(result, employee, kvp, resultList, sub_result, values, value){
        if(value.toUpperCase().includes("QTMP")){
			await this.invokeQtmp(result, employee, kvp, resultList, sub_result, values, value);
            console.log("qtmp call section!!!")
		}else {
			this.prepareCoreKvpForStaticDataSearch(kvp, sub_result, values, value);
			const sortBy = this.getDefaultSortByString(value);
			let data_list = await this.processApplicationSobjCall(employee,sortBy, kvp);
			await this.prepareCoreReponseDataForStaticDataCallMasters(false,result, kvp, resultList, sub_result, value, data_list);
		}
    }
    async invokeQtmp(result, employee, kvp, resultList, sub_result, values, value){
        await coreMethodHandler.processQueryTempalte(result, employee, kvp, resultList, sub_result, values, value);
    }
    prepareCoreKvpForStaticDataSearch(kvp, sub_result, values, value) {
        let colValue="";
        this.handleCoreKvpEnrichment(kvp, values, value, colValue);
        sub_result.set( "value", colValue);
        sub_result.set( "field", kvp.key3 );
        sub_result.set( "adkeys", kvp.adkeys);
        this.handleSpecialCharecterInIncomingQuery(kvp);
        return colValue;
    }
    handleCoreKvpEnrichment(kvp, values, value, colValue) {
        let fValue;
        switch (value.toLowerCase()){
            case "adm":
                colValue = "additional_master";
                fValue = values[values.length-1];
                kvp['value'] = colValue;
                const criteria = new SearchCriteria();
                criteria.fName = "type";
                criteria.operator = "eq";
                criteria.fValue = fValue;
                if(kvp.crList != null && Array.isArray(kvp.crList) && kvp.crList.length > 0){
                    kvp.crList.push(criteria);
                }else {
                    kvp['crList'] = [];
                    kvp.crList.push(criteria);
                }
                break;
            case "form_field_reference":
            case "grid_field_reference":
            case "grid_reference":
            case "form_reference":
            case "tab_reference":
            case "form_template_reference":
                kvp.value =  value.replace("_reference","");
                break;
            case "refresh_template":
                // templateHandler.prepareFieldWiseTemplates();
                break;
            case "available_status":
                kvp.value = "status_master";
                break;
            case "account_city" :
                if(kvp.crList != null && Array.isArray(kvp.crList) && kvp.crList.length > 0){
                    kvp.crList.forEach(searchCriteria => {
                        if(searchCriteria.fName == "name" && searchCriteria.fValue != null && searchCriteria.fValue != ""){
                            const fvalue = searchCriteria.fValue;
                            fvalue = fvalue.split("/")[0];
                            searchCriteria.fValue = fvalue;
                        }
                    });
                }
                break;
            default:
                colValue = value;
                break;
        }
        return colValue;
    }
    handleSpecialCharecterInIncomingQuery(kvp) {
        if(kvp.crList != null && Array.isArray(kvp.crList) && kvp.crList.length > 0){
            kvp.crList.forEach(searchCriteria => {
                if(searchCriteria.fValue !=null && searchCriteria.operator == "neq"  && searchCriteria.operator != "eq"  &&searchCriteria.operator != "in"  &&searchCriteria.operator != "stw"){
                    searchCriteria.fValue = commonUtils.removeSpecialCharactersByWithSameCase( searchCriteria.fValue,":" );
                }
            } );
        }
    }
    async prepareCoreReponseDataForStaticDataCallMasters(include_all, result, kvp, resultList, sub_result, value,data_list){
        const isCompleteObject = "COMPLETE_OBJECT" === this.checkType(kvp);
        if (data_list != null) {
            switch (value){
                case "country":
                case "state":
                case "city":
                case "adm":
                    if(include_all){
                        resultList.push("All");
                    }
                    data_list.forEach(object => {
                        // Convert object to a plain JavaScript object (equivalent to LinkedHashMap in Java)
                        const template = JSON.parse(JSON.stringify(object));
                    
                        // Create a JSONObject equivalent (template is already a plain object)
                        const il = template;
                    
                        // Check if "keyValue" is null or undefined
                        if (!il.hasOwnProperty("keyValue") || il["keyValue"] === null) {
                            resultList.push(il["name"].toString());
                        } else {
                            sub_result["data"] = template["keyValue"];
                        }
                    });
                    break;
                case "available_status":
                    kvp.value = "status_master";
                    data_list.forEach(object => {
                        const statusMaster = JSON.parse(JSON.stringify(object));
                        resultList.push(statusMaster.current_status);
                        resultList.push(...statusMaster.available_status);
                    });
                    break;
                case "form_field":
                case "grid_field":
                case "grid":
                case "form":
                case "tab":
                case "menu_template":
                case "form_template":
                    resultList.push(...data_list);
                    break;
                case "project_module":
                    data_list.forEach(object => {
                        const template = JSON.parse(JSON.stringify(object));
                        const il = template;
                        try {
                            try {
                                il.set("name", il.title);
                            }catch (e){
                                console.log("Error while putting prject module name {}", e.message);
                            }
                            const obj = this.getReferenceJsonObjectAsNamePicker(value,il);
                            resultList.push(obj);
                        }catch (e){
                            console.log("Error while adding reference in the list : {} {}", value,il);
                        }
                    });
                    break;
                case "account_city":
                    data_list.forEach(object => {
                        const template = JSON.parse(JSON.stringify(object));
                        const il = template;
                        try {
                            if(il.city) resultList.push(il.city);
                        }catch (e){
                            console.log("Error while adding reference in the list : {} {}", value,il);
                        }
                    })
                    break;
                case "lead_contact":
                    data_list.forEach(object => {
                        const template = JSON.parse(JSON.stringify(object));
                        const il = template;
                        try {
                            const obj = this.getReferenceJsonObjectAsNamePicker(value,il);
                            const name  = il.first_name;
                            if(il.last_name)
                                name =  name  + " " + il.last_name;
                            obj.set("name", name);
                            if(isCompleteObject){
                                obj.set('COMPLETE_OBJECT',object);
                            }
                            resultList.push(obj);
                        }catch (e){
                            console.log("Error while adding reference in the list : {} {}", value,il);
                        }
                    })
                    break;
                case "account_list" :
                    data_list.forEach(object => {
                        const template = JSON.parse(JSON.stringify(object));
                        const il = template;
                        try {
                            const obj = commonUtils.getReferenceJsonObject(il);
                            const name  = obj.name.toString();
                            if(il.city)
                                name =  name  + "/" + il.city;
                            obj.set("name", name);
                            if(isCompleteObject){
                                obj.set('COMPLETE_OBJECT',object);
                            }
                            resultList.push(obj);
                        }catch (e){
                            console.log("Error while adding reference in the list : {} {}", value,il);
                        }
                    })
                    break;
                default:
                    if(include_all){
                        resultList.push(commonUtils.allobject);
                    }
                    if(kvp.data_template) {
                        this.fetchDataAsDataTemplate(value,kvp, resultList, data_list);
                    }else if(cacheService.retriveAsStringList(value)){
                        this.getListAsName(resultList, value, data_list);
                    }else {
                        this.retrieveDataASReferenceObject(resultList, value, data_list);
                    }
                    break; 
            }
            if(sub_result.get("data")==null) {
                sub_result.set( "data", resultList);
            }
            result.get("success").push(commonUtils.mapToObj(sub_result));
        }else{
            switch(value){
                case "status" :
                    resultList.push( "Active");
                    resultList.push("Inactive");
                    sub_result.set( "data", resultList);;
                    result["success"] =  JSON.parse(JSON.stringify(sub_result));
                    break;
                case "class_fields":
                    if(kvp.crList && Array.isArray(kvp.crList) && kvp.crList.length > 0){
                        const searchCriteria = kvp.crList[0]; 
                        if(searchCriteria.fName == "name" && searchCriteria.fValue){
                            const colName = searchCriteria.fValue;
                            try {
                                const clazz = await cacheService.getModel(colName);
                                resultList.push(...commonUtils.getFieldList(clazz));                                
                            } catch (e) {
                                console.error(e.stack);
                            }
                            sub_result.set( "data", resultList);;
                            result["success"] =  JSON.parse(JSON.stringify(sub_result));
                        }
                        else {
                            sub_result.set( "data", [] );
                            result["success"] =  JSON.parse(JSON.stringify(sub_result));
                        }
                    }
                    else {
                        sub_result.set("data", []);
                        result["success"] =  JSON.parse(JSON.stringify(sub_result));
                    }                    
                    break;
                default:
                    sub_result.set("data", []);
                    result["success"] =  JSON.parse(JSON.stringify(sub_result));
                    break;
            }
        }
    }
    fetchDataAsDataTemplate(value, kvp, resultList, data_list) {
        switch (this.checkType(kvp)){
            case "COMPLETE_OBJECT":
                data_list.forEach(object => {
                    try {
                        const il = JSON.parse(JSON.stringify(object));
                        const obj = this.getReferenceJsonObjectAsNamePicker(value, il);
                        obj.set("COMPLETE_OBJECT",object);
                        resultList.push(obj);
                    } catch (e) {
                        console.log("Error while adding reference in the list : {} {}", value);
                    }
                });
                break;
            case "OBJECT_FOR_LIST":
                try{
                    resultList.push(...data_list);
                }catch (e){
                    console.log("Error while adding reference in the list : {} {}", value);
                }
                break;
            default:
                const dataConfig = cacheService.export_configuration.get(kvp.data_template.toUpperCase());
                const colMap = new Map();
                data_list.forEach(object => {                
                    try {
                        const il = JSON.parse(JSON.stringify(object));
                        const obj = new Map();
                        freeMarkerReportService.getHashMapFromJsonObjectAsPerTemplate(dataConfig.getColumnLists(), il, obj,colMap);
                        if(dataConfig.isValuesOnly()) {
                            if(obj) {
                                if (obj?.values?.length == 1)
                                    resultList.push(Object.values(obj).join(","));
                                else
                                    resultList.push(...obj.values);
                            } else resultList.push("");
                        }
                        else
                            resultList.push(obj);
                    } catch (e) {
                        console.log("Error while adding new Object in resultList {}", e.message);
                    }
                });
        }

    }
    getReferenceJsonObjectAsNamePicker(collection, il) {
        const pojoMaster = cacheService.getPojoFromCollection(collection);
        let name = "";
        const fields = pojoMaster.fields_for_reference;
        if(fields && Array.isArray(fields) && fields.length > 0) {
            for (let i = 0; i < fields.length; i++) {
                try {
                    const fieldValue = commonUtils.getValueFromJSONObject(il,fields[i]);
                    if(fieldValue) {
                        name = name + pojoMaster.field_splitter + fieldValue;
                    }
                } catch (e) {
                    console.log("Error while fetching value from object {}");
                }
            }
            name = name.substring(pojoMaster.field_splitter.length);
        }
        return commonUtils.getReferenceJsonObject(il,name);
    }
    getListAsName(resultList, value, data_list) {
        try {
            data_list.forEach(object => {
                const il = JSON.parse(JSON.stringify(object));
                resultList.push(this.getReferenceJsonObjectAsNamePicker(value, il).get("name"));
            })
        }catch (e){
            console.error(e.stack);
        }
    }
    retrieveDataASReferenceObject(resultList, value, data_list){
        if(data_list && Array.isArray(data_list) && data_list.length > 0){
            data_list.forEach(object => {
                const il = JSON.parse(JSON.stringify(object));
                try {
                    const obj = this.getReferenceJsonObjectAsNamePicker(value, il);
                    resultList.push(obj);
                } catch (e) {
                    console.log("Error while adding reference in the list : {} {}", value, il);
                }
            });
        }
    }
    checkType(kvp){
        return kvp.data_template != null ? kvp.data_template.toUpperCase():"";
    }
    enrichQueryWithDefaultCriteria(employee, colName, query,kvp){
        try {
            if(employee){
                let pojoMaster = cacheService.getPojoFromCollection(colName.toLowerCase());
                if(pojoMaster.level){
                    switch (pojoMaster.level.toUpperCase()) {
                        case "APPID":
                            query.push(new QueryCriteria('appId','string',Operators.EQUAL,employee.appId));
                            break;
                        case "REFCODE":
                            query.push(new QueryCriteria('appId','string',Operators.EQUAL,employee.refCode));
                            break;                    
                        default:
                            break;
                    }
                }
                let criteriaList = pojoMaster?.enrich_query_with || [];
                let dept_ids = commonUtils.getObjectIdFromListOfReference(employee?.departments);
                if(criteriaList){
                    criteriaList.forEach(criteria => {
                        switch (criteria.toLowerCase()) {
                            case "APPID":
                                query.push(new QueryCriteria("appId",Operators.EQUAL,employee.appId));
                                break;
                            case "REFCODE":
                                query.push(new QueryCriteria("refCode",Operators.EQUAL,employee.refCode));
                                break;
                            case "BRANCH":
                                if(!employee.admin) {
                                    query.push(new QueryCriteria("branch._id", Operators.EQUAL, employee?.branch?._id));
                                }
                                break;
                            case "DEPARTMENT":
                                if(!employee.admin) {
                                    query.push(new QueryCriteria("department._id", Operators.IN, dept_ids));
                                }
                                break;
                            case "DEPARTMENT_LIST":
                                if(!employee.admin) {
                                    query.push(new QueryCriteria("departments._id", Operators.IN, dept_ids));
                                }
                                break;
                            case "ACCOUNT" :
                                if(!employee.admin) {
                                    query.push(new QueryCriteria("account._id", Operators.IN, commonUtils.getIdFromListOfReference(employee.accounts)));
                                }
                                break;
                            case "LEAD" :
                                query.push(new QueryCriteria("lead._id",Operators.IN,commonUtils.getIdFromListOfReference(employee.accounts)));
                                break;
                            case "CUSTOMER" :
                                query.push(new QueryCriteria("customer._id",Operators.IN,commonUtils.getIdFromListOfReference(employee.accounts)));
                                break;
                            case "PARTY" :
                                query.push(new QueryCriteria("party._id",Operators.IN,commonUtils.getIdFromListOfReference(employee.accounts)));
                                break;
                            case "OWN_ACCOUNTS" :
                                if(!employee.isAdmin()) {
                                    query.push(new QueryCriteria("_id", Operators.IN, commonUtils.getIdFromListOfReference(employee.accounts)));
                                }
                                break;
                            case "TEAM" :
                                query.push(new QueryCriteria("team._id",Operators.IN,commonUtils.getIdFromListOfReference(employee.list1)));
                                break;
                            case "APPROVERS" :
                                query.push(new QueryCriteria("approvers._id",Operators.EQUAL,employee._id));
                                break;
                            case "CREATED_BY" :
                                if(!employee.admin) {
                                    query.push(new QueryCriteria("createdBy", Operators.EQUAL_IGNORE_CASE, employee.email));
                                }
                                break;
                        
                            default:
                                break;
                        }
                    });
                }
                if (kvp.role) {
                    this.getRoleWiseCriteria(kvp, colName,query,employee);
                }   
            }
        } catch (error) {
            
        }
    }
    getRoleWiseCriteria(kvp, colName,query,employee){
        let key = '';
        key += kvp.key2 + "_";
        key += kvp.key + "_";
        key += kvp.module + "_";
        key += colName + "_";
        key += kvp.role;
        let criteria = null;
        if (permissionHandler.getAppResourceCriteria(key.toString())) {
            criteria = permissionHandler.getAppResourceCriteria(key.toString());
        }
        if (criteria) {
            let selfData = criteria.selfData;
            if(selfData){
                if(this.checkDublicatCriteria(query,"createdBy").check){
                    query.splice(this.checkDublicatCriteria(query,"createdBy").index, 1);
                }
                query.push(new QueryCriteria("createdBy",'string', Operators.EQUAL, employee.email));
            }
            if (criteria.crList && criteria.crList.length > 0) {
                for (let cr of criteria.crList) {
                    this.processCreateCriteria(cr, query);
                }
            }
            if (customCriteria.userCrList && Array.isArray(customCriteria.userCrList) && customCriteria.userCrList.length > 0) {
                for (let cr of customCriteria.userCrList) {
                    let field = cr.fName;
                    let field_name = field.field_name;
                    if(this.checkDublicatCriteria(query,field_name).check){
                        let index = this.checkDublicatCriteria(query,field_name).index;
                        query.splice(index,1);
                    }
                    let fieldValue = cr.fValue;
                    let type = fieldValue.type;
                    let value = fieldValue.value;
                    switch (type){
                        case "List":
                            let ids = [];
                            if (Array.isArray(value)) {
                                value.forEach(element => {
                                    if (element && typeof element === 'object') {
                                        const obj = element;
                                        if (obj._id) {
                                            ids.push(obj._id);
                                        }
                                    }
                                });
                            }   
                            if (ids.length > 0) {
                                query.push({ field_name: field_name, operator: 'IN', value: ids });
                            }                         
                            break;
                        case "object":
                            let id = null;
                            if (value && typeof value === 'object' && value._id) {
                                id = value._id;
                            }
                            if (id) {
                                query.push({ field_name: field_name, operator: cr.getOperator(), value: id });
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            
        }
    }
    processCreateCriteria(cr, query){
        let fieldObject = cr.fName;
        let fieldValueObj = cr?.fValue;
        let fName = null;
        if(fieldObject && fieldObject.field_name){
            fName = fieldObject.field_name;
        }
        if (fieldValueObj && fieldValueObj?.value){ 
            let value =  fieldValueObj?.value;         
            let type = fieldValueObj?.type;
            switch(type) {
                case "string":
                    query.push(new QueryCriteria(fName, null, cr.operator, value.toString()));
                    break;
                case "number" :
                    query.push(new QueryCriteria(fName, null, cr.gperator, parseInt(value.toString(),10)));
                    break;
                case "date":
                    query.push(new QueryCriteria(fName, null, Operators.RANGE_BORDER_GREATER_THAN_INCLUSIVE,commonUtils.convertStringToDate(value.toString())));
                    query.push(new QueryCriteria(fName, null, Operators.RANGE_BORDER_LESS_THAN_INCLUSIVE,commonUtils.endOfDay(commonUtils.convertStringToDate(value.toString()))));
                    break;
                case "daterange":
                    let objValue = gson.fromJson(value.toString(), QueryFieldRange.class);
                    let start = objValue.getStart();
                    let end = objValue.getEnd();
                    query.push(new QueryCriteria(fName, null, Operators.RANGE_BORDER_GREATER_THAN_INCLUSIVE,commonUtils.setDateToMidnight(commonUtils.convertStringToDate(start))));
                    query.push(new QueryCriteria(fName, null, Operators.RANGE_BORDER_LESS_THAN_INCLUSIVE,commonUtils.endOfDay(commonUtils.convertStringToDate(end))));
                    break;
                case "object":
                    let reference = JSON.parse(JSON.stringify(value));
                    query.push(new QueryCriteria(fName, null, cr.operator, reference._id));
                    break;
                case "List":
                    let listReference = JSON.parse(JSON.stringify((value)));
                    let val = "";
                    for (let ref of listReference) {
                        let id = ref._id;
                        if (val == '') {
                            val = val + id;
                        } else {
                            val = val + ":" + id;
                        }
                    }
                    query.push(new QueryCriteria(fName, null, cr.operator, val));
                    break;
                default :
                    break;
            }
        }
    }
    checkDublicatCriteria(query, value){
        let responce = {
            check : false,
            index : -1
        };
        for (let i = 0; i < query.length; i++){
            let cr = query[i];
            if (cr.field.toLowerCase() == value.toLowerCase()) {
                responce.check = true;
                responce.index = i;
                break;
            }
        }
       return responce;
    }
}
module.exports = RetrievalQueryHandler;