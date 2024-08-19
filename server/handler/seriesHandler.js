const cacheService  = require('../cache/cacheService');
const CommonUtils = require('../utils/commonUtils');
const AccountBookHandler = require('./accountBookHandler');

const commonUtil = new CommonUtils();

const JSON_DATE_FORMAT = "EEE, dd MMM yyyy HH:mm:ss zzz";
const JSON_DATE_FORMAT_2 ="yyyy-MM-dd'T'HH:mm:ss.SS";

const accountBookHandler = new AccountBookHandler();


class SeriesHandler{

    
    populate_series(coll, jsonObject, jsonObjectForSeriesDetails, accountBook){
        const srNumber = 0;
        if (jsonObject.srNumber == null || jsonObject.srNumber == 0) {
            const pojoMaster = cacheService.getPojoFromCollection(coll.toLowerCase());
            const series=pojoMaster.defaultSeries;
            const seriesType =pojoMaster.seriesMethod==null?"CONTINUOUS":pojoMaster.seriesMethod;
            const seriesPattern = pojoMaster.defaultSeries;
            const pattern=pojoMaster.series_pattern==null?(seriesPattern+"-[srNumber]"):pojoMaster.series_pattern;
            const on_date = pojoMaster.series_on_date_field;
            let objectseriesMethod=null;
            try {
                objectseriesMethod = cacheService.getSeriesMethod(jsonObject?.refCode, coll);
                if(objectseriesMethod){
                    seriesType =objectseriesMethod.series_type;
                    if(objectseriesMethod.exDeptl && Array.isArray(objectseriesMethod.exDept) && objectseriesMethod.exDept.length > 0){
                        if(jsonObject.department) {
                            if (objectseriesMethod.exDept.includes(jsonObject?.department?.name)) {
                                seriesType = objectseriesMethod.exDeptSeriesType;
                            }
                        }
                    }
                    seriesPattern = objectseriesMethod.series;
                    pattern=objectseriesMethod.pattern;
                    on_date = objectseriesMethod.on_date;
                }
            }catch (e){
                console.log("Error in getting setting from applicable pojo",e.message);
            }
            if(objectseriesMethod==null && pojoMaster.series_method != null && (pojoMaster.series_method.get(jsonObject.refCode) != null)){
                const seriesMethod = pojoMaster.series_method.get(jsonObject.refCode);
                seriesType = seriesMethod.get("series_type");
                seriesPattern = seriesMethod.get("series");
                pattern=seriesMethod.get("pattern");
                on_date = seriesMethod.get("on_date");
            }
            let date = null;
            if (on_date){
                if(jsonObject.on_date == null || jsonObject.on_date == '') {
                    jsonObject.on_date = commonUtil.convertDateToStandardDateTimeWithFormat(new Date(), JSON_DATE_FORMAT);
                }
                if(jsonObject[on_date].indexOf("-") === 4){
                    date = commonUtil.changeStringDateToSpecificFormat(jsonObject[on_date], JSON_DATE_FORMAT_2);
                }else {
                    try {
                        date = commonUtil.changeStringDateToSpecificFormat(jsonObject[on_date], JSON_DATE_FORMAT);
                    }catch (e){
                        date = commonUtil.changeStringDateToSpecificFormat(jsonObject[on_date],  "MMM d, yyyy, HH:mm:ss");
                    }
                }
            }
            const object_series = seriesPattern==null?series:this.getConvertedString(jsonObject,seriesPattern);
            switch (seriesType.toUpperCase()) {
                case "DAILY":
                    srNumber = accountBookHandler.getDailyBookSerialNumber(jsonObject.getString("refCode"), object_series, date, accountBook);
                    break;
                case "MONTHLY":
                    // srNumber = accountBookHandler.getMonthlyBookSerialNumber(jsonObject.getString("refCode"), object_series, date, accountBook);
                    console.log("monthly account book.")
                    break;
                case "YEARLY":
                    // srNumber = accountBookHandler.getRunningYearlyBookSerialNumber(jsonObject.getString("refCode"), object_series, date, accountBook);
                    console.log("YEARLY account book.")
                    break;
                case "FINANCEYEAR":
                    // srNumber = accountBookHandler.getYearlyBookSerialNumber(jsonObject.getString("refCode"), object_series, date, accountBook);
                    console.log("FINANCEYEAR account book.")
                    break;
                case "CONTINUOUS":
                    srNumber = accountBookHandler.getBookSerialNumber(jsonObject.getString("refCode"), object_series, accountBook);
                    break;
            }
            jsonObject.srNumber = srNumber;
            jsonObject.series = object_series;
            jsonObject.serialId = this.getConvertedString(jsonObject, pattern);
            if(jsonObjectForSeriesDetails != null) {
                jsonObjectForSeriesDetails.srNumber = srNumber;
                jsonObjectForSeriesDetails.series = object_series;
                jsonObjectForSeriesDetails.serialId = this.getConvertedString(jsonObject, pattern);
            }
            console.log("srNumber :{} , series :{}, serialId : {}" + srNumber,object_series,jsonObject.serialId);
        }

    }    
    getConvertedString(ja, incomingTemplate) {
        let template = incomingTemplate.toString();
        const pattern = /\[(.*?)\]/g;
        let match;
        const listMatches = [];
    
        while ((match = pattern.exec(template)) !== null) {
            listMatches.push(match[1]);
            const details = match[1];
            const valueString = getStringValue(details, ja);
            template = template.replace(`[${details}]`, valueString);
        }
    
        return template;
    }
    getStringValue(details, ja) {
        let stringVal = '';
        let format = null;
        const valueConfig = details.split(',');
        const objArray = valueConfig[0].split('.');
    
        if (valueConfig.length >= 4) {
            format = valueConfig[3];
        }
    
        let jsonObject = ja;
    
        if (objArray[0].toLowerCase() === 'none') {
            stringVal = objArray[1];
        } else {
            if (format && format.trim() && format.toUpperCase() === 'LIST') {
                try {
                    for (let i = 0; i < objArray.length - 1; i++) {
                        jsonObject = this.getJsonObject(jsonObject, objArray[i]);
                    }
                    stringVal = jsonObject[objArray[objArray.length - 1]].toString();
                    stringVal = stringVal.replace(/"|[\[\]]/g, '');
                } catch (e) {
                    console.error("Error while fetching data from arrayList", e.message);
                }
            } else {
                let object = jsonObject;
                for (let i = 0; i < objArray.length - 1; i++) {
                    object = this.getJsonObject(object, objArray[i]);
                }
                jsonObject = object;
    
                try {
                    stringVal = jsonObject[objArray[objArray.length - 1]].toString();
                    if (format && format.trim() && valueConfig[1].toLowerCase() === 'date') {
                        const date = this.getDate(stringVal);
                        if (date === null) {
                            stringVal = '-';
                        } else {
                            stringVal = moment(date).format(format);
                        }
                    }
                } catch (e) {
                    stringVal = '-';
                    console.error(objArray[objArray.length - 1] + " not found");
                }
            }
        }
    
        return this.getAdjustedString(stringVal, valueConfig);
    }
    getJsonObject(jsonObject, field) {
        try {
            if (Array.isArray(jsonObject)) {
                return jsonObject[parseInt(field, 10)];
            } else if (jsonObject instanceof Object) {
                return jsonObject[field];
            }
        } catch (e) {
            return null;
        }
    }
    getDate(stringVal) {
        let date = null;
        
        try {
            if (stringVal.indexOf("-") === 4) {
                date = commonUtil.changeStringDateToSpecificFormat(stringVal, JSON_DATE_FORMAT_2);
                if (stringVal.endsWith("T18:30:00.000Z")) {
                    date = commonUtil.addCurrentTimeInDate(date);
                }
            } else {
                try {
                    date = commonUtil.changeStringDateToSpecificFormat(stringVal, JSON_DATE_FORMAT);
                } catch (e) {
                    date = commonUtil.changeStringDateToSpecificFormat(stringVal, "MMM d, yyyy, HH:mm:ss");
                }
            }
        } catch (e) {
            console.error("Unparsable Date", e.message);
        }
        
        return date;
    }
    getAdjustedString(string, valueConfig) {
        let formatString = '%s';
        let value = '';
        let stringRequiredLength = 0;
    
        if (valueConfig.length > 2 && !isNaN(valueConfig[2])) {
            stringRequiredLength = parseInt(valueConfig[2], 10);
        }
    
        if (stringRequiredLength > 0) {
            const splittype = valueConfig[1].toLowerCase();
            switch (splittype) {
                case 'post':
                case 'date':
                    formatString = `%-${stringRequiredLength}s`;
                    value = (string || '').toUpperCase().padEnd(stringRequiredLength, ' ');
                    break;
                case 'substring':
                    const indexes = valueConfig[3].split(':');
                    if (indexes.length > 1) {
                        value = string.substring(parseInt(indexes[0], 10), parseInt(indexes[1], 10));
                    } else {
                        value = string.substring(parseInt(indexes[0], 10));
                    }
                    break;
                default:
                    if (string) {
                        if (stringRequiredLength > 0 && string.length > stringRequiredLength) {
                            string = string.substring(0, stringRequiredLength);
                        }
                    }
                    formatString = valueConfig[3].repeat(stringRequiredLength);
                    value = formatString + (string || '');
                    value = value.substring(value.length - stringRequiredLength);
            }
        } else {
            const splittype = (valueConfig != null && valueConfig.length > 1) ? valueConfig[1].toLowerCase() : '';
            switch (splittype) {
                case 'financialyear':
                    // Implement financial year logic
                    const date = getDate(string);
                    if (valueConfig != null && valueConfig.length === 4) {
                        const formatter = moment(date);
                        const currentYear = formatter.year();
                        const currentMonth = formatter.month() + 1;
                        if (currentMonth < 4) {
                            formatter.year(currentYear - 1).month(3).date(31);
                            const previous = formatter.format(valueConfig[3]);
                            formatter.year(currentYear).month(2).date(31);
                            const current = formatter.format(valueConfig[3]);
                            value = previous + valueConfig[2] + current;
                        } else {
                            formatter.year(currentYear).month(3).date(1);
                            const current = formatter.format(valueConfig[3]);
                            formatter.year(currentYear + 1).month(2).date(31);
                            const next = formatter.format(valueConfig[3]);
                            value = current + valueConfig[2] + next;
                        }
                    }
                    break;
                default:
                    value = string || '';
            }
        }
    
        return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
module.exports = SeriesHandler;