const CommonUtils = require("../utils/commonUtils");
const QueryCriteria = require("./queryHandler/queryCriteria");
const QueryHandler = require("./queryHandler/queryHandler");

const queryHandler = new QueryHandler();
const commonutil = new CommonUtils();
class CollectionHandler {
    async findDocumentById(model,id,key,list){
        let user = null;        
        if(key){
            var query = {};           
           query[key] = id;
           if(list){
            user = await model.findOne(query).select(list);
           }else{
            user = await model.findOne(query);
           }           
        }else{
            if(list){
                user = await model.findById(id).select(list);
            }else{
                user = await model.findById(id);
            }
        }
        return user;
    }
    async findAllDocuments(model,list){
        var list = [];
        if(list){
          list = await model.find({}).select(list).exec();
        }else{
          list = await model.find({}).exec();
        }
        return list;
    }
    async findDocument(model, field, value, dbName='') {
        const valueObject  = commonutil.getValueFromJSONObject(field, value);
        let queryCriteriaList = [];
		queryCriteriaList.push(new QueryCriteria(field,"string",Operator.EQUAL,valueObject));
        const query = queryHandler.buildMongoQuery(queryCriteriaList);
        let list = [];
        try {
          list = await model.find(query)                        
                        .exec();
        } catch (error) {
            console.log(error);
        }
        if(list && Array.isArray(list) && list.length > 0){
            return list[0];
        }        
        return null;        
    }
    async findAllDocumentsWithListQueryCriteria(model,queryCriteriaList,orderBy,pageNo,limit){
        const query = queryHandler.buildMongoQuery(queryCriteriaList);
        var skipAmount = (pageNo - 1) * limit;
        const sortObject = queryHandler.handleSort(orderBy);
        let list = [];
        try {
          list = await model.find(query)
                        .sort(sortObject)
                        .skip(skipAmount)
                        .limit(limit)
                        .exec();
        } catch (error) {
            console.log(error);
        }
        return list;
    }  
    async findDocumentsWithListQueryCriteria(model, queryCriteriaList,  orderBy, dbName = '') {
        const query = queryHandler.buildMongoQuery(queryCriteriaList);
        const sortObject = queryHandler.handleSort(orderBy);
        try {
            list = await model.find(query)
                          .sort(sortObject)
                          .exec();
          } catch (error) {
              console.log(error);
          }
        if(list && Array.isArray(list) && list.length > 0){
            return list[0];
        }        
        return null;
    }
    async findFirstDocumentWithListQueryCriteria(model, queryCriteriaList, dbName = "") {
        const query = queryHandler.buildMongoQuery(queryCriteriaList);
        const result = await model.find(query).exec();
        if (result && Array.isArray(result) && result.length > 0) {
            return result[0];
        }
        return null;
    }
    async count(clazz, queryCriteriaList) {        
        const query = queryHandler.buildMongoQuery(queryCriteriaList);
        const count  = await clazz.countDocuments(query);
        return count;
    }  
    async insertDocument(object){
        try {
            await object.save();
        } catch (error) {
            console.log("Insert Document Issue : =" + error);
        }
    }
    insertDocumentWithLog(model, jsonObject,  obj){
        try {
            model.save(obj);
        } catch (error) {
            
        }
    }
    // saveModificationLog(clazz, imcomingObject) {
    //     try {
    //         ModificationLog log = new ModificationLog();
    //         log.setCollection_name(clazz.getName());
    //         log.setObject_id(imcomingObject.getString("_id"));
    //         log.setCurrentObject(mapper.readValue(imcomingObject.toString(), Map.class));
    //         log.setCreatedDate(new Date());
    //         try {
    //             log.setCreatedByName(imcomingObject.isNull("createdByName") ?(imcomingObject.isNull("updatedByName")?"System Admin":imcomingObject.getString("updatedByName")) : imcomingObject.getString("createdByName"));
    //         }catch (Exception e){

    //         }
    //         insertDocument(log);
    //         LOGGER.info("Modification log saved for {} - {} ", imcomingObject.getString("_id"));
    //     } catch (Exception e) {
    //         LOGGER.info("Error while saving modification log {}",e.getMessage());
    //         e.printStackTrace();
    //     }
    // }   
    
}

module.exports = CollectionHandler;