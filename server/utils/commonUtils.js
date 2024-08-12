const path = require('path');
const { pathToFileURL } = require('url');
const cacheService = require('../cache/cacheService');
const Config = require('../enum/config');
const moment = require('moment');
const Reference = require('../model/reference');


class CommonUtils {
// Function to dynamically import models based on path
    async getModel(collectionName) {
        const modelPath = this.getModulePath(collectionName);
        let model = null;
        if(path){
            const filePath = Config.PACKAGE_PATH + modelPath +'.js';
            const projectRoot = process.cwd();
            const absolutePath = path.resolve(projectRoot, filePath);

            // Validate the file path and extension
            if (!absolutePath.endsWith('.js') && !absolutePath.endsWith('.mjs')) {
                throw new Error('The file path must end with .js or .mjs');
            }

            // Convert the absolute path to a file URL
            const fileUrl = pathToFileURL(absolutePath).href;

            const file = await import(fileUrl);
            model =  file.default;
        }
        return model;
    }
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
    getModulePath(colName){
        let modulePath = null;
        const pojo = cacheService.getPojoFromCollection(colName);
        if(pojo && pojo.pojo.class_name){
            modulePath = pojo?.pojo?.class_name;
        }
        return modulePath;
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
    removeSpecialCharactersByWithSameCase(str, separator) {
        if (str && str.trim() !== "") {
            return str.replace(/[^0-9a-zA-Z]/g, separator);
        }
        return null;
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
        return JSON.parse(JSON.stringify(obj));
    }
}

module.exports = CommonUtils;