const Operators = require("../enum/operator");
const CommonUtils = require("../utils/commonUtils");
const cacheService  = require('../cache/cacheService');
const QueryCriteria = require("./queryHandler/queryCriteria");

const commonUtil = new CommonUtils();

class ObjectKeyHandler {
    getUniqueKeyQuery(collection, jsonObject){
        return this.enrichQueryForUniqueKey(collection, this.getPrimaryKeyFields( collection ),jsonObject );
    }
    getPrimaryKeyFields(name){
        const pojoMaster = staticDataCache.getPojoMaster(name);
        const primaryKeys = [];
        if(pojoMaster.primaryKeys){
            if(pojoMaster.level){
                switch (pojoMaster.level){
                    case "REFCODE":
                        primaryKeys.push("refCode"); break;
                    case "APPID":
                        primaryKeys.push("appId"); break;
                }
            }
            primaryKeys.push(...pojoMaster.primaryKeys);
            return primaryKeys;
        }
        return ["altname"];
    }
    enrichQueryForUniqueKey(collection, fields, jsonObject){
        const queryCriteriaList = [];
        try {
            if(jsonObject.refCode){
                const queryCriteria = new QueryCriteria();
                queryCriteria.field = "refCode";
                queryCriteria.operator = Operators.EQUAL;
                queryCriteria.value = jsonObject.refCode;
                queryCriteriaList.push(queryCriteria);
            }
        }catch (e){
            console.error(e.stack);
        }
        try {
            if (jsonObject.name) {
                jsonObject.altname =  commonUtil.getTrimmedString(jsonObject.name);
            }
        }catch (e){
            console.error(e.stack);
        }
        if(fields && Array.isArray(fields) && fields.length > 0){
            fields.forEach( field =>{
                try {
                    const fieldType = cacheService.getFieldMap().get( (collection.toLowerCase() +"_"+ field) );
                    if (fieldType == null) fieldType = "string";
                    const value = commonUtil.getValueFromJSONObject( jsonObject, field ).toString();
                    const queryCriteria = new QueryCriteria();
                    queryCriteria.field = field;
                    queryCriteria.operator = Operators.EQUAL;
                    queryCriteria.value = value;
                    queryCriteriaList.push(queryCriteria);
                }catch (e){
                    const queryCriteria = new QueryCriteria();
                    queryCriteria.field = field;
                    queryCriteria.operator = Operators.DO_NOT_EXIST;
                    queryCriteriaList.push(queryCriteria);
                    console.log( "Error while enriching query to fetch unique key {},{}",field,e.message );
                }
            });
        }
        return queryCriteriaList;
    }
}
module.exports = ObjectKeyHandler;