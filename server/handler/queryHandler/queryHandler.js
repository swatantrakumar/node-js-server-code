const cacheService = require('../../cache/cacheService');
const Operator = require('../../enum/operator');
const CommonUtils = require('../../utils/commonUtils');
const QueryCriteria = require('./queryCriteria');

const { ObjectId } = require('mongodb');

const commonUtil = new CommonUtils();
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
    enrichQuery(collection, keyValuePair, criteriaList) {
		const fieldType = null;
		if (keyValuePair.crList && Array.isArray(keyValuePair.crList) && keyValuePair.crList.length > 0) {
			const crList = keyValuePair.crList;
			for (let crCount = 0; crCount < crList.length; crCount++) {
				const searchCriteria = crList[crCount];
				const fName = searchCriteria.fName;
				fieldType = cacheService.getFieldMap().get(collection.toLowerCase() +"_"+ fName);                
				if (fieldType == null) {
					if (fName == "createdDate" || fName == "updateDate") {
						fieldType = "date";
					} else {
						fieldType = "string";
					}
				}
				if (searchCriteria.fValue) {
					this.populateQuery( criteriaList, searchCriteria.operator, fName,searchCriteria.fValue, fieldType );
				}
			}
		} else if (keyValuePair.criteria && keyValuePair.criteria.size > 0) {
			for (const [key, value] of keyValuePair.criteria.entries()) {
				fieldType = staticDataCache.getFieldMap().get( (collection.toLowerCase() +"_"+ key.toString().toLowerCase()) );
				if (fieldType) {
					this.fieldTypeEqualIgnoreCase(criteriaList, key.toString(), value.toString());
				}
			}
		}
	}
    populateQuery(criteriaList, matchCriteria, field, value, fieldType) {
		const values = null;
		switch (matchCriteria) {
			case "eq": this.eq(criteriaList, field, value, fieldType); break;
			case "eqic": this.fieldTypeEqualIgnoreCase(criteriaList, field, value); break;
			case "neq": this.fieldTypeNotEqual(criteriaList, field, value, fieldType); break;
			case "in": this.in(criteriaList, field, value, fieldType,Operator.IN); break;
			case "notin": this.in(criteriaList, field, value, fieldType,Operator.NOT_IN); break;
			case "stw": this.stw(value, field, matchCriteria, values, fieldType, criteriaList, Operator.STARTS_WITH); break;
			case "stwic": this.stw(value, field, matchCriteria, values, fieldType, criteriaList, Operator.STARTS_WITH_IGNORE_CASE); break;
			case "edw" : this.edw(value,field,matchCriteria,values,fieldType,criteriaList,Operator.ENDS_WITH); break;
			case "edwic" : this.edwic(value,field,matchCriteria,values,fieldType,criteriaList,Operator.ENDS_WITH_IGNORE_CASE); break;
			case "cnts": this.cnts(criteriaList, matchCriteria, field, value, fieldType,Operator.CONTAINS); break;
			case "cntsic": this.cnts(criteriaList, matchCriteria, field, value, fieldType,Operator.CONTAINS_IGNORE_CASE); break;
			case "ncnts": this.ncnts(criteriaList, matchCriteria, field, value, fieldType,Operator.NOT_CONTAINS); break;
			case "ncntsic": this.ncnts(criteriaList, matchCriteria, field, value, fieldType,Operator.NOT_CONTAINS_IGNORE_CASE); break;
			case "gt": this.comparisonUsingOperator(fieldType, value, criteriaList, field, Operator.GREATER_THAN); break;
			case "lt": this.comparisonUsingOperator(fieldType, value, criteriaList, field, Operator.LESS_THAN); break;
			case "gte": this.comparisonUsingOperator(fieldType, value, criteriaList, field, Operator.RANGE_BORDER_GREATER_THAN_INCLUSIVE); break;
			case "lte": this.comparisonUsingOperator(fieldType, value, criteriaList, field, Operator.RANGE_BORDER_LESS_THAN_INCLUSIVE); break;
			default: console.log("Match Criteria Not Supported.. Kindly check criteria " + matchCriteria);
		}
	}
    eq(criteriaList, field, value, fieldType) {
		if(value) {
			this.fieldTypeEqual(criteriaList, field, value, fieldType, false);
		}
	}
    fieldTypeEqual(criteriaList, field, value, fieldType, equalIgnoreCase) {
		switch (fieldType.toLowerCase()) {
			case "string":
			case "text":
				if(value) {
					if (equalIgnoreCase) {
						this.fieldTypeEqualIgnoreCase(criteriaList, field, value);
					} else {
						criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.EQUAL,value));
					}
				}
				break;
			case "boolean":
				if(value) {
                    criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.EQUAL,commonUtil.parseBoolean(value)));
				}
				break;
			case "int":
				if(value) {
					criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.EQUAL,parseInt(value,10)));
				}
				break;
			case "double":
				if (value) {
					const intValue = this.getValueAsObject(fieldType.toLowerCase(),value);					
					criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.RANGE_BORDER_GREATER_THAN_INCLUSIVE,(intValue - 0.50)));
					criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.LESS_THAN,(intValue + 0.50)));					
				}
				break;
			case "date":
				if(value) {
					switch (value.toLowerCase()){
						case "today":
							criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.RANGE_BORDER_GREATER_THAN_INCLUSIVE,commonUtil.setDateToMidnight(new Date())));
							criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.RANGE_BORDER_LESS_THAN_INCLUSIVE,commonUtil.endOfDay(new Date())));
							break;
						case "last-7-days":
							criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.RANGE_BORDER_GREATER_THAN_INCLUSIVE,commonUtil.setDateToMidnight(commonUtil.getDateAfterDays(new Date(),-8))));
							criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.RANGE_BORDER_LESS_THAN_INCLUSIVE,commonUtil.endOfDay(commonUtil.getDateAfterDays(new Date(),-1))));

							break;
						default:
							criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.RANGE_BORDER_GREATER_THAN_INCLUSIVE,this.getValueAsObject(fieldType.toLowerCase(),value)));
							criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.RANGE_BORDER_LESS_THAN_INCLUSIVE,commonUtil.endOfDay(this.getValueAsObject(fieldType.toLowerCase(),value))));
					}
				}
				break;
			default:
				if(value) {
					this.fieldTypeEqualIgnoreCase(criteriaList, field, value);
				}
				break;
		}
	}
    fieldTypeEqualIgnoreCase(criteriaList, field, value) {
		if(value) {
			criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,"string", Operator.EQUAL_IGNORE_CASE,value));
        }
	}
    fieldTypeNotEqual(criteriaList, field, value, fieldType) {
		switch (fieldType.toLowerCase()) {
			case "boolean":
				if(value) {
					criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.NOT_EQUAL,commonUtil.parseBoolean(value)));
				}
				break;
			case "int":
				if(value) {
					criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.NOT_EQUAL,parseInt(value,10)));
				}
				break;
			case "double":
				if(value) {
					criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.NOT_EQUAL,parseFloat(value)));
				}
				break;
			default:
				if(value) {
					criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field,fieldType.toLowerCase(), Operator.NOT_EQUAL,value));
				}
				break;
		}
	}
    in(criteriaList, field, value, fieldType,operator) {
		if(value) {
			this.queryOperatorIN(criteriaList, field, value, fieldType,operator);
		}
	}
    stw(value, field, matchCriteria, values, fieldType, criteriaList, startsWith) {
		if(value) {
			value = this.handSpecialCharecterSearch(field, matchCriteria, value);
			values = value.split(":");
			switch (fieldType.toLowerCase()) {
				case "string":
				case "text":
					criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), startsWith, values[0]));
					if (values.length > 1) {
						for (let i = 1; i < values.length; i++) {
							criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), Operator.CONTAINS, values[i]));

						}
					}
					break;
			}
		}
	}
    edw(value, field, matchCriteria, values, fieldType, criteriaList, endWith) {
		if(value) {
			value = this.handSpecialCharecterSearch(field, matchCriteria, value);
			values = value.split(":");
			switch (fieldType.toLowerCase()) {
				case "string":
				case "text":
					criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), endWith, values[0]));
					if (values.length > 1) {
						for (let i = 1; i < values.length; i++) {
							criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), Operator.ENDS_WITH, values[i]));

						}
					}
					break;
			}
		}
	}
    edwic(value, field, matchCriteria, values, fieldType, criteriaList,endWithIgnoreCase) {
		if(value) {
			value = this.handSpecialCharecterSearch(field, matchCriteria, value);
			values = value.split(":");
			switch (fieldType.toLowerCase()) {
				case "string":
				case "text":
					criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), endWithIgnoreCase, values[0]));
					if (values.length > 1) {
						for (let i = 1; i < values.length; i++) {
							criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), Operator.ENDS_WITH_IGNORE_CASE, values[i]));

						}
					}
					break;
			}
		}
	}
    cnts(criteriaList, matchCriteria, field, value, fieldType, contains) {
		let values = [];
		value = this.handSpecialCharecterSearch(field, matchCriteria, value);
		values = value.includes("##") ? value.split("##") : value.split(":");

		switch (fieldType.toLowerCase()) {
			case "string":
			case "text":
				if(value) {
					if (values.length >= 1) {
						if (contains == Operator.CONTAINS){
							for (let i = 0; i < values.length; i++) {
								criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), Operator.CONTAINS,values[i]));
							}
							break;
						}
						if(contains == Operator.CONTAINS_IGNORE_CASE){
							for (let i = 0; i < values.length; i++) {
								criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), Operator.CONTAINS_IGNORE_CASE,values[i]));
							}
							break;
						}

					}
					break;
				}
				break;

			default: console.log("Match Criteria Not Supported.. Kindly check criteria " + matchCriteria);


		}
	}
	ncnts(criteriaList, matchCriteria, field, value, fieldType, contains) {
		let values;
		value = this.handSpecialCharecterSearch(field, matchCriteria, value);
		values = value.includes("##") ? value.split("##") : value.split(":");

		switch (fieldType.toLowerCase()) {
			case "string":
			case "text":
				if(value) {
					if (values.length >= 1) {
						if (contains == Operator.NOT_CONTAINS){
							for (let i = 0; i < values.length; i++) {
								criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), Operator.NOT_CONTAINS,values[i]));
							}
							break;
						}
						if(contains == Operator.NOT_CONTAINS_IGNORE_CASE){
							for (let i = 0; i < values.length; i++) {
								criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), Operator.NOT_CONTAINS_IGNORE_CASE,values[i]));
							}
							break;
						}

					}
					break;
				}
				break;

			default: console.log("Match Criteria Not Supported.. Kindly check criteria " + matchCriteria);


		}
	}
	comparisonUsingOperator(fieldType, value, criteriaList, field, operator) {
		switch (fieldType.toLowerCase()) {
			case "date":
				if(value) {
					if(operator == Operator.LESS_THAN || operator == Operator.RANGE_BORDER_LESS_THAN_INCLUSIVE)
						criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), operator,commonUtil.endOfDay(this.getValueAsObject(fieldType.toLowerCase(), value))));
					else
						criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), operator,commonUtil.setDateToMidnight(this.getValueAsObject(fieldType.toLowerCase(), value))));
				}
				break;

			default:
				criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(), operator,this.getValueAsObject(fieldType.toLowerCase(), value)));
		}
	}
    handSpecialCharecterSearch(field, operator, value) {
		switch (field){
			case "altname":
			case "alternateName":
				if(commonUtil.removeSpecialCharactersByWithSameCase(value, "") !== ""){
					value = commonUtil.removeSpecialCharactersByWithSameCase(value, ":");
				}
				break;
			default:
				if(commonUtil.removeSpecialCharactersByWithSameCase(value, "") !== "") {
					if (value.startsWith(" ")) {
						value = " " + commonUtil.removeSpecialCharactersByWithSameCase(value.substring(1), ":");
					} else {
						value = commonUtil.removeSpecialCharactersByWithSameCase(value, ":");
					}
				}

		}
		return value;
	}
    queryOperatorIN(criteriaList, field, value, fieldType,operator) {
		const values = [];
		values = value.includes("##") ? value.split("##") : value.split(":");
		switch (fieldType.toLowerCase()) {
			case "date":
				break;

			default:
				const valueList = [];
				for(let i=0; i < values.length; i++){
					if(field.includes("._id") && fieldType == "string"){
						const objID = new ObjectId(this.getValue(values[i]));
						valueList.push(objID);
					}else{
						const valueObject = getValueAsObject(fieldType.toLowerCase(),values[i]);
						if(valueObject) valueList.push(valueObject);
					}
				}

				criteriaList.push(QueryCriteria.createWithFieldTypeOperatorAndValueOrList(field, fieldType.toLowerCase(),operator,valueList));
		}

	}
    getValue(value) {
		return value != null ? value.toString() : "";
	}
    getValueAsObject(fieldType,value){
		try {
			if(value) {
				if (fieldType == null) fieldType = "string";
				fieldType = fieldType.toLowerCase();
				switch (fieldType) {
					case "string":
					case "text":
						return value;
					case "int":
						return parseInt(value,10);
					case "date":
						return commonUtil.convertStringToDate(value);
					case "double":
						return parseFloat(value);
					case "boolean":
						return commonUtil.parseBoolean(value);
				}
			}
		}catch (e){
			console.log("Error while getingValueObject.. {}",e.message);
		}
		return null;
	}
}
module.exports = QueryHandler;