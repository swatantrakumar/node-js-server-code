const Operators = require("../enum/operator");
const ModificationLog = require("../model/generic/modificationLog");
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
    async findDocument(model, field, value,operator = Operators.EQUAL, dbName='') {
        const valueObject  = commonutil.getValueFromJSONObject(field, value);
        let queryCriteriaList = [];
		queryCriteriaList.push(new QueryCriteria(field,"string",operator,valueObject));
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
    async insertDocumentWithLog(model, jsonObject,  obj){
        let result = null;
        try {
            const filter = { _id: obj._id };  // or any other unique field
            const update = { $set: obj };  // the fields to update
            const options = { upsert: true, new: true };  // upsert inserts if not found, new returns the updated doc
            result = await model.findOneAndUpdate(filter, update, options);            
            await this.saveModificationLog(jsonObject);
        } catch (e) {
            console.log(e.stack);
            console.error("Exception Encountered with Creating Document");
        }
        return result;
    }
    async saveModificationLog(imcomingObject) {
        try {
            const log = new ModificationLog();
            log.collection_name = imcomingObject._class;
            log.object_id = imcomingObject._id;
            log.currentObject = JSON.parse(JSON.stringify(imcomingObject));
            log.createdByName = imcomingObject.createdByName ? imcomingObject.createdByName : imcomingObject.updatedByName  ? imcomingObject.updatedByName : "System Admin" ;
            
            await this.insertDocument(log);
            console.log("Modification log saved for {} - {} ", imcomingObject._id);
        } catch (e) {
            console.log("Error while saving modification log {}"+e.message);
            console.error(e.stack)
        }
    }   
    
}

module.exports = CollectionHandler;