const path = require('path');
const { pathToFileURL } = require('url');
const cacheService = require('../cache/cacheService');
const Config = require('../enum/config');
const moment = require('moment');


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
}

module.exports = CommonUtils;