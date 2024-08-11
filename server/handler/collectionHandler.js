const QueryHandler = require("./queryHandler/queryHandler");

const queryHandler = new QueryHandler();
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
    async count(clazz, queryCriteriaList) {        
        const query = queryHandler.buildMongoQuery(queryCriteriaList);
        const count  = await clazz.countDocuments(query);
        return count;
    }  
    
    
}

module.exports = CollectionHandler;