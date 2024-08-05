

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
        const query = await this.buildMongoQuery(queryCriteriaList);
        var skipAmount = (pageNo - 1) * limit;
        const sortObject = {};
        if(orderBy){
            const sortCriteria = orderBy.split(",");            
            sortCriteria.forEach(sort => {
                let field = sort;
                let value = 1;
                if(sort.indexOf("-") == 0){
                    field = sort.substring(1)
                    value = -1;
                }
                sortObject[field] = value;            
            });
        }        
        const finalQuery = { query: query, sort: sortObject };
        const list = await model.find(finalQuery)
                        .skip(skipAmount)
                        .limit(limit)
                        .exec();
        return list;
    }
    // Function to handle different operators
   handleOperator(fname, operator, value, type){
    let mongoValue = value;
    let query = {};

    if (type === 'date') {
      mongoValue = new Date(value);
    } else if (type === 'number') {
      mongoValue = Number(value);
    } else if (type === 'array') {
      mongoValue = Array.isArray(value) ? value : [value];
    }

    switch (operator) {
      case 'EQUAL':
        query = { [fname]: { $eq: mongoValue } };
      case 'NOT_EQUAL':
        query = { [fname]: { $ne: mongoValue } };
      case 'EQUAL_IGNORE_CASE':
        query = { [fname]: { $regex: new RegExp(`^${mongoValue}$`, 'i') } };
      case 'IN':
        query = { [fname]: { $in: mongoValue } };
      case 'NOT_IN':
        query = { [fname]: { $nin: mongoValue } };
      case 'RANGE_BORDER_BOTH_INCLUSIVE':
        query = { [fname]: { $gte: mongoValue[0], $lte: mongoValue[1] } };
      case 'RANGE_BORDER_GREATER_THAN_INCLUSIVE':
        query = { [fname]: { $gte: mongoValue } };
      case 'RANGE_BORDER_LESS_THAN_INCLUSIVE':
        query = { [fname]: { $lte: mongoValue } };
      case 'RANGE_BORDER_BOTH_EXCLUSIVE':
        query = { [fname]: { $gt: mongoValue[0], $lt: mongoValue[1] } };
      case 'GREATER_THAN':
        query = { [fname]: { $gt: mongoValue } };
      case 'LESS_THAN':
        query = { [fname]: { $lt: mongoValue } };
      case 'STARTS_WITH':
        query = { [fname]: { $regex: new RegExp(`^${mongoValue}`) } };
      case 'STARTS_WITH_IGNORE_CASE':
        query = { [fname]: { $regex: new RegExp(`^${mongoValue}`, 'i') } };
      case 'ENDS_WITH':
        query = { [fname]: { $regex: new RegExp(`${mongoValue}$`) } };
      case 'ENDS_WITH_IGNORE_CASE':
        query = { [fname]: { $regex: new RegExp(`${mongoValue}$`, 'i') } };
      case 'CONTAINS':
        query = { [fname]: { $regex: new RegExp(mongoValue) } };
      case 'CONTAINS_IGNORE_CASE':
        query = { [fname]: { $regex: new RegExp(mongoValue, 'i') } };
      case 'NOT_CONTAINS':
        query = { [fname]: { $not: new RegExp(mongoValue) } };
      case 'NOT_CONTAINS_IGNORE_CASE':
        query = { [fname]: { $not: new RegExp(mongoValue, 'i') } };
      case 'LIKE':
        query = { [fname]: { $regex: new RegExp(mongoValue, 'i') } };
      case 'EXISTS':
        query = { [fname]: { $exists: mongoValue } };
      case 'DO_NOT_EXIST':
        query = { [fname]: { $exists: false } };
      case 'HAS_ALL_OF':
        query = { [fname]: { $all: mongoValue } };
      case 'HAS_SIZE':
        query = { [fname]: { $size: mongoValue } };
      case 'NEAR':
        query = { [fname]: { $nearSphere: mongoValue } }; // Assuming mongoValue is [coordinates, maxDistance]
      case 'AND':
      case 'OR':
      case 'NOR':
      case 'NOT':
        query = {};
      default:
        query = {};
    }
    return query;
  };
    // Function to handle logical operators
    handleLogicalOperators = (logicalOperator, conditions) => {
        switch (logicalOperator) {
          case 'and':
            return { $and: conditions };
          case 'or':
            return { $or: conditions };
          default:
            return {};
        }
    };
    async buildMongoQuery(queryList) {
        // Process the query list
        const andConditions = [];
        const orConditions = [];
      
        queryList.forEach(query => {
          const { fname, operator, value, type } = query;
          const condition = this.handleOperator(fname, operator, value, type);
          andConditions.push(condition);
        //   if (logicalOperator) {
        //     if (logicalOperator === 'and') {
        //       andConditions.push(condition);
        //     } else if (logicalOperator === 'or') {
        //       orConditions.push(condition);
        //     }
        //   } else {
        //     // Default to AND conditions if no logical operator is specified
        //     andConditions.push(condition);
        //   }
        });
      
        // // Combine the conditions
        // if (andConditions.length > 0 && orConditions.length > 0) {
        //   return { $and: [this.handleLogicalOperators('or', orConditions), this.handleLogicalOperators('and', andConditions)] };
        // }
        // if (andConditions.length > 0) {
        //   return this.handleLogicalOperators('and', andConditions);
        // }
        // if (orConditions.length > 0) {
        //   return this.handleLogicalOperators('or', orConditions);
        // }
        return andConditions;
      };
}

module.exports = CollectionHandler;