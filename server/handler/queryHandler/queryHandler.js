class QueryHandler {
    constructor(parameters) {
        
    }
    // Function to handle logical operators
    handleLogicalOperators = (logicalOperator, conditions) => {
        if (!Array.isArray(conditions)) {
            throw new Error('Conditions must be an array');
        }
        switch (logicalOperator) {
            case 'AND':
                return { $and: conditions };
            case 'OR':
                return { $or: conditions };
            case 'NOR':
                return { $nor: conditions };
            case 'NOT':
                return { $not: conditions };
            default:
                return {};
        }
    };
    buildMongoQuery(queryList) {
        // Process the query list
        const andConditions = [];
        const orConditions = [];
        const norConditions = [];
        const notConditions = [];
      
        queryList.forEach(query => {
          const { field, operator, value, type, logicalOperator } = query;
          const condition = this.handleOperator(field, operator, value, type);
        //   andConditions.push(condition);
          if (logicalOperator) {
            if (logicalOperator === 'AND') {
              andConditions.push(condition);
            } else if (logicalOperator === 'OR') {
              orConditions.push(condition);
            } else if (logicalOperator === 'NOR') {
                norConditions.push(condition);
            } else if (logicalOperator === 'NOT') {
                notConditions.push(condition);
            }
          } else {
            // Default to AND conditions if no logical operator is specified
            andConditions.push(condition);
          }
        });
      
        // Combine the conditions
        const finalQuery = {};

        if (andConditions.length > 0) {
            finalQuery.$and = andConditions;
        }
        if (orConditions.length > 0) {
            finalQuery.$or = orConditions;
        }
        if (norConditions.length > 0) {
            finalQuery.$nor = norConditions;
        }
        if (notConditions.length > 0) {
            finalQuery.$not = notConditions;
        }
        
        return finalQuery;
    };
    handleSort(orderBy){
        let sortObject = {};
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
        return sortObject;
    }
    // Function to handle different operators
    handleOperator(field, operator, value, type){
        if (field == null || operator == null) {
            return {};
        }
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
                query[field] = { $eq: mongoValue } ;
                break;
            case 'NOT_EQUAL':
                query[field] = { $ne: mongoValue } ;
                break;
            case 'EQUAL_IGNORE_CASE':
                query[field] = { $regex: new RegExp(`^${mongoValue}$`, 'i') };
                break;
            case 'IN':
                query[field] = { $in: mongoValue };
                break;
            case 'NOT_IN':
                query[field] = { $nin: mongoValue };
                break;
            case 'RANGE_BORDER_BOTH_INCLUSIVE':
                query[field] = { $gte: mongoValue[0], $lte: mongoValue[1] };
                break;
            case 'RANGE_BORDER_GREATER_THAN_INCLUSIVE':
                query[field] = { $gte: mongoValue };
                break;
            case 'RANGE_BORDER_LESS_THAN_INCLUSIVE':
                query[field] = { $lte: mongoValue };
                break;
            case 'RANGE_BORDER_BOTH_EXCLUSIVE':
                query[field] = { $gt: mongoValue[0], $lt: mongoValue[1] };
                break;
            case 'GREATER_THAN':
                query[field] = { $gt: mongoValue };
                break;
            case 'LESS_THAN':
                query[field] = { $lt: mongoValue };
                break;
            case 'STARTS_WITH':
                query[field] = { $regex: new RegExp(`^${mongoValue}`) };
                break;
            case 'STARTS_WITH_IGNORE_CASE':
                query[field] = { $regex: new RegExp(`^${mongoValue}`, 'i') };
                break;
            case 'ENDS_WITH':
                query[field] = { $regex: new RegExp(`${mongoValue}$`) };
                break;
            case 'ENDS_WITH_IGNORE_CASE':
                query[field] = { $regex: new RegExp(`${mongoValue}$`, 'i') };
                break;
            case 'CONTAINS':
                query[field] = { $regex: new RegExp(mongoValue) };
                break;
            case 'CONTAINS_IGNORE_CASE':
                query[field] = { $regex: new RegExp(mongoValue, 'i') };
                break;
            case 'NOT_CONTAINS':
                query[field] = { $not: new RegExp(mongoValue) };
                break;
            case 'NOT_CONTAINS_IGNORE_CASE':
                query[field] = { $not: new RegExp(mongoValue, 'i') };
                break;
            case 'LIKE':
                query[field] = { $regex: new RegExp(mongoValue, 'i') };
                break;
            case 'EXISTS':
                query[field] = { $exists: mongoValue };
                break;
            case 'DO_NOT_EXIST':
                query[field] = { $exists: false };
                break;
            case 'HAS_ALL_OF':
                query[field] = { $all: mongoValue };
                break;
            case 'HAS_SIZE':
                query[field] = { $size: mongoValue };
                break;
            case 'NEAR':
                query[field] = { $nearSphere: mongoValue }; // Assuming mongoValue is [coordinates, maxDistance]
                break;
            default:
                query = {};
                break;
        }
        return query;
    };
}
module.exports = QueryHandler;