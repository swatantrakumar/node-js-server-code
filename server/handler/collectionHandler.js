const mongoose = require('mongoose');
const Operators = require("../enum/operator");
const ModificationLog = require("../model/generic/modificationLog");
const CommonUtils = require("../utils/commonUtils");
const QueryCriteria = require("./queryHandler/queryCriteria");
const QueryHandler = require("./queryHandler/queryHandler");
const Config = require('../enum/config');

const queryHandler = new QueryHandler();
const commonutil = new CommonUtils();
class CollectionHandler {
    constructor(){
        this.connectionCache = {};
    }
    
    async findDocumentById(model,id,key='',list=''){
        let user = null;        
        if(key){
            var query = {};           
            query[key] = id;
            user = await model.findOne(query).select(list);                    
        }else{
            user = await model.findById(id).select(list);
        }
        return user;
    }
    async findAllDocuments(model, select='', queryCriteriaList = {}, orderBy=null){
        const query = queryHandler.buildMongoQuery(queryCriteriaList);
        const sortObject = queryHandler.handleSort(orderBy);
        let dataList = [];
        try {
            dataList = await model.find(query)
                        .sort(sortObject)
                        .select(select)
                        .exec();
        } catch (error) {
            console.log(error);
        }
        return dataList;
    }
    async checkDocumentExists(model,queryCriteriaList){
        model = await this.getModelForNewDb(model,"central_notifier");
        const query = queryHandler.buildMongoQuery(queryCriteriaList);
        return model.exists(query);
    }
    async getModelForNewDb(model,dbName){
        let modelName = model.modelName ? model.modelName : model.collection ? model.collection.modelName : '';
        let collectionName = model.collection.name;
        let schema = model.schema;
        dbName = dbName ? dbName : model?.db?.name
        if(dbName){
            let getDbConnection = await this.getDynamicDbConnection(dbName);
            // Create and return the dynamic model
            let dbModel = getDbConnection.model(modelName, schema, collectionName);
            if(dbModel){
                model = dbModel;
            }
        }
        return model;
    }
    async findDocument(model, field, value,operator = Operators.EQUAL, dbName='') {
        let object = {};
        object[field] = value;
        const valueObject  = commonutil.getValueFromJSONObject(object,field);
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
    async findAllDocumentsWithListQueryCriteria(model,queryCriteriaList,orderBy=null,pageNo=1,limit,select = '',dbName = ''){
        if(dbName){
            model = await this.getModelForNewDb(model,"central_notifier");            
        }
        const query = queryHandler.buildMongoQuery(queryCriteriaList);
        var skipAmount = (pageNo - 1) * limit;
        const sortObject = queryHandler.handleSort(orderBy);
        let list = [];
        try {
          list = await model.find(query)
                        .sort(sortObject)
                        .skip(skipAmount)
                        .limit(limit)
                        .select(select)
                        .exec();
        } catch (error) {
            console.log(error);
        }
        return list;
    }  
    async findDocumentsWithListQueryCriteria(model, queryCriteriaList,  orderBy, dbName = '') {
        const query = queryHandler.buildMongoQuery(queryCriteriaList);
        const sortObject = queryHandler.handleSort(orderBy);
        let list = [];
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
    async insertDocument(object,dbName=''){        
        try {
            if(dbName){
                let model = await this.getModelForNewDb(object,dbName);
                let objectWithModel = new model(object);
                await objectWithModel.save();
            }else{
                await object.save();
            }            
        } catch (error) {
            console.log("Insert Document Issue : =" + error);
        }
    }
    async updateDocument(object,dbName=''){
        let result = null;
        try {
            const filter = { _id: object._id };  // or any other unique field
            const update = { $set: object };  // the fields to update
            const options = { upsert: true, new: true };  // upsert inserts if not found, new returns the updated doc
            let model = await this.getModelForNewDb(object,dbName);
            result = await model.findOneAndUpdate(filter, update, options);
            let jsonObject = JSON.parse(JSON.stringify(object));
            await this.saveModificationLog(jsonObject);  
        } catch (e) {
            console.log(e.stack);
            console.error("Exception Encountered with Creating Document");
        }
        return result;
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
    async getDynamicDbConnection(dbName) {
        // Reuse the existing connection if it exists
        if (this.connectionCache[dbName]) {
            return this.connectionCache[dbName];
        }
      
        // Create a new connection for the specified database
        const connection = await mongoose.createConnection(Config.MONGODB_URI, { 
            dbName: dbName,
            connectTimeoutMS: 50000, // Increase timeout to 30 seconds
            serverSelectionTimeoutMS: 50000 // Increase server selection timeout 
        });
      
        // Cache the connection for future use
        this.connectionCache[dbName] = connection;
        return connection;
    }
    
}

module.exports = CollectionHandler;