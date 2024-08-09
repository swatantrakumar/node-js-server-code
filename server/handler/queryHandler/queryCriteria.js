const Operators = require("../../enum/operator");

class QueryCriteria {
    constructor(field, fieldType, operator, value) {
        this.field = field;
        this.fieldType = fieldType;
        this.operator = operator;
        this.value = value;
        this.greaterThan = null;
        this.lessThan = null;
        this.pattern = null;
        this.listOfItems = [];
        this.orderBy = null;
        this.latitude = 0.0;
        this.longitude = 0.0;
        this.spherical = true;
        this.maxDistance = 0.0;
        this.maxRecords = 50;
        this.criteriaList = [];
    }

    static createWithFieldAndValue(field, value) {
        return new QueryCriteria(field, null, Operators.EQUAL_IGNORE_CASE, value);
    }

    static createWithFieldOperatorAndValue(field, operator, value) {
        return new QueryCriteria(field, null, operator, value);
    }

    static createWithFieldTypeOperatorAndValueOrList(field, fieldType, operator, valueOrList) {
        if (Array.isArray(valueOrList)) {
            const criteria = new QueryCriteria(field, fieldType, operator, null);
            criteria.listOfItems = valueOrList;
            return criteria;
        } else {
            return new QueryCriteria(field, fieldType, operator, valueOrList);
        }
    }
}

module.exports = QueryCriteria;