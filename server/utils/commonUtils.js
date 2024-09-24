
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
        let childObject = parentObj;
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
        if (child && parentObject) {
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
    hasKeyInJsonObject(jsonObject, key) {
        return jsonObject !== null && jsonObject.hasOwnProperty(key) && jsonObject[key] !== null;
    }
    getDecimalAmount(value) {
        try {
            const parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) {
                throw new Error("Invalid number");
            }
            return parseFloat(parsedValue.toFixed(2)); // Ensures 2 decimal places
        } catch (e) {
            return 0.0;
        }
    }
    getDate(invdate) {
        const dummyDate = new Date(2099, 11, 2); // December 2, 2099
    
        // Check if the input is numeric and parseable
        if (!isNaN(parseFloat(invdate)) && isFinite(invdate)) {
            return new Date(parseFloat(invdate));
        } else {
            // Handle different invalid or special cases
            const invalidValues = ['null', '0', 'N-A', 'N/A', 'N.A.', 'N.A'];
            if (invdate && !invalidValues.includes(invdate.trim())) {
                // Normalize date string by removing spaces and replacing slashes with dashes
                invdate = invdate.replace(/\s+/g, '').replace(/\//g, '-');
    
                // Define patterns and corresponding regular expressions
                const patterns = {
                    'MM-yy': /^\d{2}-\d{2}$/,
                    'dd-MMM-yyyy': /^\d{2}-[A-Za-z]{3}-\d{4}$/,
                    'yyyy-MM-dd': /^\d{4}-\d{2}-\d{2}$/,
                    'dd-MM-yyyy': /^\d{2}-\d{2}-\d{4}$/,
                    'dd-MMM-yy': /^\d{2}-[A-Za-z]{3}-\d{2}$/,
                    'MM-yyyy': /^\d{2}-\d{4}$/,
                    'dd-MM-yy': /^\d{2}-\d{2}-\d{2}$/,
                    'MMM-yyyy': /^[A-Za-z]{3}-\d{4}$/
                };
    
                // Check which pattern matches the input
                for (const [pattern, regex] of Object.entries(patterns)) {
                    if (regex.test(invdate)) {
                        // Normalize to a format that JavaScript can parse, like yyyy-MM-dd
                        const parts = invdate.split('-');
                        let formattedDate;
    
                        switch (pattern) {
                            case 'MM-yy':
                                formattedDate = `20${parts[1]}-${parts[0]}-01`; // Assumes the day is the 1st
                                break;
                            case 'dd-MMM-yyyy':
                                formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                                break;
                            case 'yyyy-MM-dd':
                                formattedDate = invdate;
                                break;
                            case 'dd-MM-yyyy':
                                formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                                break;
                            case 'dd-MMM-yy':
                                formattedDate = `20${parts[2]}-${parts[1]}-${parts[0]}`;
                                break;
                            case 'MM-yyyy':
                                formattedDate = `${parts[1]}-${parts[0]}-01`; // Assumes the day is the 1st
                                break;
                            case 'dd-MM-yy':
                                formattedDate = `20${parts[2]}-${parts[1]}-${parts[0]}`;
                                break;
                            case 'MMM-yyyy':
                                formattedDate = `${parts[1]}-${parts[0]}-01`; // Assumes the day is the 1st
                                break;
                        }
    
                        return new Date(formattedDate);
                    }
                }
            }
        }
        return dummyDate;
    }
    convertJsonStringToDate(date) {
        const [month, day, year, time, period] = date.split(/[\s,]+/);
        const formattedDate = `${month} ${day}, ${year} ${time} ${period}`;
        
        const parsedDate = new Date(formattedDate);
        
        if (isNaN(parsedDate)) {
            throw new Error('Unable to parse date');
        }
        
        return parsedDate;
    }
    convertDateToTime(date, format) {
        // Moment expects the date to be in JavaScript Date format, so passing the Date object directly
        return moment(date).format(format);
    }
    getValueFromJSONObjectFromAnyLevel(parentObj, jsonField) {
        try {
            let childObject = parentObj;
    
            if (jsonField) {
                const fields = jsonField.split('.'); // Split the jsonField by '.'
                
                if (fields && fields.length > 0) {
                    // Traverse through the nested JSON fields
                    childObject = this.getChildJSONObjectFromField(childObject, fields, 0, fields.length - 1);
                } else {
                    // Handle the case where jsonField doesn't contain any '.'
                    childObject = this.getChildJSONObject(childObject, jsonField);
                }
            }
    
            return childObject;
        } catch (error) {
            console.error(error);
            return ""; // Return empty string on failure
        }
    }
    getChildJSONObjectFromField(parentObject, fields, startIndex, endIndex) {
        // Base case: if we've reached the end of the field chain
        if (startIndex === endIndex || startIndex > endIndex) {
            if (Array.isArray(parentObject)) {
                // If the parentObject is an array, return the indexed value
                return parentObject[parseInt(fields[endIndex])];
            } else if (typeof parentObject === 'object' && parentObject !== null) {
                // Handle objects (can be Array, plain object, or JSON objects)
                return parentObject[fields[endIndex]];
            }
            return null; // If it's not an array or object, return null
        }
    
        // Recursive case: if we are still processing the fields
        if (Array.isArray(parentObject)) {
            // Handle array traversal
            return this.getChildJSONObjectFromField(parentObject[parseInt(fields[startIndex])], fields, startIndex + 1, endIndex);
        } else if (typeof parentObject === 'object' && parentObject !== null) {
            if (parentObject.hasOwnProperty(fields[startIndex])) {
                return getChildJSONObjectFromField(parentObject[fields[startIndex]], fields, startIndex + 1, endIndex);
            }
            return null; // If the object doesn't contain the expected field, return null
        }
        return null;
    }
    getObjectIdFromListOfReference(references) {
        const _ids = [];
    
        if (references && references.length > 0) {
            references.forEach(department => {
                if (department._id) {
                    _ids.push(department._id);
                }
            });
        }
    
        return _ids;
    }
    getIdFromListOfReference(references) {
        let _ids = [];
        if(references && references.length > 0) {
            references.forEach(department => {
                _ids.push(department._id);
            });
        }
        return _ids;
    }
}

module.exports = CommonUtils;