
const moment = require('moment');
const Reference = require('../model/reference');


class CommonUtils {
// Function to dynamically import models based on path
    
    getFieldList(schema, prefix = '') {
        const resultList = [];
    
        // Iterate over schema paths
        schema.eachPath((path, schemaType) => {
            // Full path with prefix
            const fullPath = prefix ? `${prefix}.${path}` : path;
    
            // Check if the type is a nested schema
            if (schemaType instanceof mongoose.Schema.Types.Embedded) {
                // If it's a nested schema, recursively get its fields
                if (schemaType.schema === Reference) {
                    resultList.push(`${path}.code`);
                    resultList.push(`${path}.name`);
                    resultList.push(`${path}._id`);
                }else{
                    resultList.push(...getFieldList(schemaType.schema, fullPath));
                }                
            } else {
                resultList.push(fullPath);
            }
        });
    
        return resultList;
    }
    mapToObj(map) {
        const obj = {};
        for (let [key, value] of map.entries()) {
          if (value instanceof Map) {
            obj[key] = this.mapToObj(value);
          } else if (Array.isArray(value)) {
            obj[key] = value.map(item => (item instanceof Map ? this.mapToObj(item) : item));
          } else {
            obj[key] = value;
          }
        }
        return obj;
    }
    decodeBase64(encodeData){
        return JSON.parse(Buffer.from(encodeData, 'base64').toString('utf-8'));
    }
    
    getReference(obj){
        let ref = {};
        if(obj?._id) ref['_id'] = obj._id;
        if(obj?.code) ref['code'] = obj.code;
        if(obj?.serialId) ref['serialId'] = obj.serialId;
        if(obj?.name) ref['name'] = obj.name;
        return ref;
    }
    getExcludeColumns(excludeFields){
        let selectString = '';
        if(excludeFields && excludeFields.length > 0){
            selectString = excludeFields.map(field => `-${field}`).join(' ');
        }
        return selectString;        
    }
    getSelectColumns(selectFields){
        let selectString = '';
        if(selectFields && selectFields.length > 0){
            selectString = selectFields.map(field => `${field}`).join(' ');
        }
        return selectString;        
    }
    cloneObject(obj){
        return JSON.parse(JSON.stringify(obj));
    }
    parseBoolean(value) {
        return String(value).toLowerCase() === 'true';
    }
    convertStringToDate(strDate) {
        const date = moment(strDate, "DD/MM/YYYY").toDate();
        return date;
    }
    endOfDay(date) {
        const endOfDayDate = new Date(date);        
        // Set the time to 23:59:59.999
        endOfDayDate.setHours(23, 59, 59, 999);        
        return endOfDayDate;
    }
    setDateToMidnight(date) {
        const midnightDate = new Date(date);        
        // Set the time to 00:00:00.000
        midnightDate.setHours(0, 0, 0, 0);        
        return midnightDate;
    }
    getDateAfterDays(aDate, n) {
        const newDate = new Date(aDate);        
        // Add n days to the date (or subtract if n is negative)
        newDate.setDate(newDate.getDate() + n);
        
        return newDate;
    }
    convertDateToStandardDateTimeWithFormat(date, pattern) {        
        const reportDate = moment(date).format(pattern);
        return reportDate;
    }
    changeStringDateToSpecificFormat(date, pattern) {
        const parsedDate = moment(date, pattern, true);
        if (!parsedDate.isValid()) {
            throw new Error('Invalid date or pattern');
        }
        return parsedDate.toDate();
    }
    removeSpecialCharactersByWithSameCase(str, separator) {
        if (str && str.trim() !== "") {
            return str.replace(/[^0-9a-zA-Z]/g, separator);
        }
        return null;
    }
    getMonth(date) {
        if (!date) return null;
        return moment(date).format('MM');
    }
    getFinancialDay(date) {
        return getYYMMDD(date);
    }    
    getYYMMDD(date) {
        if (!date) return null;
        return moment(date).format('YYMMDD');
    }
    addCurrentTimeInDate(date) {
        if (!date) return null;
    
        const now = moment(); // Current date and time
        const currentHour = now.hour();
        const currentMinute = now.minute();
        const currentSecond = now.second();
    
        // Set the time of the provided date to the current time
        return moment(date)
            .set({ hour: currentHour, minute: currentMinute, second: currentSecond, millisecond: 0 })
            .toDate();
    }
    getFinancialYear(date) {
        if (!date) return null;
    
        const year = moment(date).format('YYYY');
        const month = parseInt(moment(date).format('MM'), 10);
    
        return month <= 3 ? (parseInt(year, 10) - 1).toString() : year;
    }
    allobject(){
        return {
            _id: "ALL",
            name: "All",
            code: "ALL"
        }
    };
    getReferenceJsonObject(il,name='') {        
        const obj = new Map();
        try {
            obj.set( "_id", il._id ? il._id.toString():"");
            if(il.code){
                obj.set( "code", il.code.toString() );
            }  else if(il.serialId){
                obj.set( "code", il.serialId.toString());
            }
            obj.set('name', name === "" 
                            ? (il.name === null || il.name === undefined 
                                ? obj.code 
                                : il.name) 
                            : name);
            if(il.type){
                obj.set( "type", il.type.toString());
            }
            if(il.version){
                obj.set( "version", il.version);
            }else{
                obj.set( "version",0);
            }
        }catch (e){
            console.error(e.stack);
        }
        return obj;
    }
    populateFieldFromTo(from,to,field){
        try {
            if(from.has(field) && from[field]) {
                to.set( field, from[field] );
            }else{
                console.log( field + " does not exist in from_Json" );
            }
        } catch (e) {
            console.error(e.stack);
        }
    }
    getJsonAcceptableDate(date) {
        if (date != null) {            
            const reportDate = moment(date).utc().format("ddd, DD MMM YYYY HH:mm:ss [GMT]");            
            return reportDate;
        } else {
            return null;
        }
    }
    getTrimmedString(string) {
        if (string && string.trim() !== "") {
            return string.replace(/[^0-9a-zA-Z]/g, "").toUpperCase();
        }
        return null;
    }
    getValueFromJSONObject(parentObj, jsonfield){
        const childObject = parentObj;
        if (jsonfield) {
            const fields = jsonfield.split(/\./);
            if (fields && fields.length > 0) {
                for (let index = 0; index < fields.length; index++) {
                    const field = fields[index];
                    childObject = this.getChildJSONObject(childObject, field);                    
                }
            } else {
                childObject = this.getChildJSONObject(childObject, jsonfield);
            }
        }
        return childObject;
    }
    getChildJSONObject(parentObject, child) {
        if (child != null && parentObject != null) {
            if (Array.isArray(parentObject)) {
                return parentObject[parseInt(child)];
            } else {
                const value = parentObject[child];
            
                if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                    return value; // It's a plain object
                } else if (value !== null && Array.isArray(value)) {
                    return value; // It's an array
                } else if (value !== null) {
                    return value; // It's some other value (e.g., a string, number, etc.)
                } else {
                    return null;
                }
            }
        }
        return null;
    }
    copyProperties(source, target) {
        try {
            if (source && target) {
                Object.assign(target, source);
            }
        } catch (error) {
            console.error('Error during copyProperties:', error);
        }
    }
}

module.exports = CommonUtils;