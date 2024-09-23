const Operators = require("../enum/operator");
const GridConfigDetails = require("../model/builder/gridConfigDetails");
const CommonUtils = require("../utils/commonUtils");
const CollectionHandler = require("./collectionHandler");
const templateHandler = require("../handler/templateHandler");
const ExcelJS = require('exceljs');
const colorMap = require("../enum/colorMap");
const UserPermissionHandler = require("./userPermissionHandler");
const QueryHandler = require("./queryHandler/queryHandler");
const cacheService = require('../cache/cacheService');
const { json } = require("express");
const QueryCriteria = require("./queryHandler/queryCriteria");
const ExportConfiguration = require("../model/generic/exportConfiguration");
const SearchCriteriaSchema = require("../model/generic/searchCriteria");

const collectionHandler = new CollectionHandler();
const commonUtil = new CommonUtils();
const userPermissionHandler = new UserPermissionHandler();
const queryHandler = new QueryHandler();

class PrintReportHandler {
    async createReport(tabName,object){
        let pageSize = 75;
        let pageNo = 1;

        let fieldNameMap = new Map();
        let fieldTypeMap = new Map();

        let gridConfigDetails = await collectionHandler.findDocument(GridConfigDetails,'name',tabName,Operators.EQUAL_IGNORE_CASE);
        let fieldTypeMapList = null;

        if(gridConfigDetails == null){
            let grid = templateHandler.gridMap.get(tabName);
            fieldTypeMapList = [];
            if(grid && grid.gridColumns && grid.gridColumns.length > 0){
                for (const gridField of grid.gridColumns) {
                    let field = {};
                    field.field = gridField.field_name;
                    field.displayName = gridField.label;
                    field.format = gridField.format;
                    field.getValueFromJson = true;
                    this.getFieldType(gridField,field);
                    fieldTypeMapList.push(field);
                }
            }
        }else{
            fieldTypeMapList = gridConfigDetails.columnDefs;
        }

        let dataMapList = null;
        let kvp = null;
        let keyValuePair = null;

        try {
            kvp = object.kvp;
            keyValuePair = JSON.parse(JSON.stringify(kvp));
        } catch (error) {
            console.error(error.stack);
            console.log("Error while fetching kvp");
        }

        let exportConfiguration = null;

        try {
            let queryCriteriaList = [];
            queryCriteriaList.push(new QueryCriteria("collectionName","string",Operators.EQUAL_IGNORE_CASE,keyValuePair.value,'OR'));
            queryCriteriaList.push(new QueryCriteria("applicableForAlias","string",Operators.EQUAL_IGNORE_CASE,keyValuePair.value,'OR'));
            exportConfiguration = await collectionHandler.findDocumentsWithListQueryCriteria(ExportConfiguration,queryCriteriaList,null);
        } catch (error) {
            exportConfiguration = null;
        }

        if (exportConfiguration && exportConfiguration.columnLists && exportConfiguration.columnLists.length > 0) {
            let columns = exportConfiguration.columnLists;
            for (let index = 0; index < columns.length; index++) {
                const column = JSON.parse(JSON.stringify(columns[index]));
                if(column && column.columnType && (column.columnType.toLowerCase() == 'flat' || column.columnType.toLowerCase() == 'list')){
                    let updated = false;
                    if(column.columnList && Array.isArray(column.columnList) && column.columnList.length > 0){
                        for (const col of column.columnList) {
                            updated = false;
                            this.updateColumnInColumnTypeList(col,fieldTypeMapList,updated);
                        }
                    }else{
                        if(column){
                            this.updateColumnInColumnTypeList(column,fieldTypeMapList,updated);
                        }
                    }
                }                
            }
        }

        let headerBackGround = new Map();
        let headerColor = new Map();
        let rowBackGround = new Map();
        let rowColor = new Map();
        let styles = new Map();
        let fieldNameList = [];

        for (let index = 0; index < fieldTypeMapList.length; index++) {
            const field = fieldTypeMapList[index];
            const fieldName = field.field;
            const displayName = field.displayName;
            const type = field.type;
            fieldNameList.push(fieldName);

            fieldNameMap.set(fieldName,displayName);
            fieldTypeMap.set(fieldName,type ? type : "string");
            headerBackGround.set(displayName,field && field.headerbackground ? field.headerbackground : "WHITE");
            headerColor.set(displayName,field && field.headercolor ? field.headercolor : "BLACK");
            rowBackGround.set(fieldName,field && field.rowbackground ? field.rowbackground : "WHITE")
            rowColor.set(fieldName,field && field.rowcolor ? field.rowcolor : "BLACK");
        }

        try {
            // Create a new workbook
            const workbook = new ExcelJS.Workbook();

            // Create a new sheet
            const sheet = workbook.addWorksheet('FirstSheet');

            
            // Row index to start populating from
            let rowIndex = sheet.lastRow ? sheet.lastRow.number + 1 : 1;
            let row = sheet.getRow(rowIndex);

            // Column index starts at 1 (Excel columns are 1-based)
            let column = 0;

            fieldTypeMapList.forEach((field,i) => {
                column++; // Move to the next column
              
                const fieldName = field.field;
                const displayName = field.displayName;
                const fieldType = field.type;
                const fieldFormat = field.format;
              
                // Create a cell in the current row and column
                const cell = row.getCell(column);
                cell.value = displayName;
              
                // Apply header style
                styles.set(fieldName + "_HEADER", this.getStyle(fieldName,headerBackGround,headerColor, true));
                const headerStyle = styles.get(fieldName + "_HEADER");
                cell.style = headerStyle;
              
                // Set up cell styles for data rows (not header)
                styles.set(i + "_CELL", this.getStyle(fieldName,rowBackGround,rowColor, false));
              
                if (fieldType === 'date' || fieldType === 'daterange') {
                  styles.get(i + "_CELL").numFmt = fieldFormat || 'dd-mmm-yyyy'; // Default date format
                }             
                
            });

            let columnsName = commonUtil.getSelectColumns(fieldNameList || []);
            let clazz = null;
            try {
                clazz = await cacheService.getModel(keyValuePair.value);
            } catch (error) {
                console.log("Error while fetching class by colName {}", colName);
            }
            let tab = commonUtil.getValueFromJSONObject(object, "kvp.tab");
            let applicationUser = userPermissionHandler.getApplicationUser(object);
            let criteriaList = [];
            // retrievalQueryHandler.enrichQueryWithDefaultCriteria(applicationUser, tab, criteriaList, keyValuePair);
            queryHandler.enrichQuery(tab, keyValuePair, criteriaList);

            for (let j = 0; j <= pageNo; j++) {
                dataMapList = await collectionHandler.findAllDocumentsWithListQueryCriteria(clazz,criteriaList,null,pageNo,pageSize,columnsName);

                if(dataMapList && dataMapList.length > 0){
                    for (let index = 0; index < dataMapList.length; index++) {
                        column = 0;
                        const rowData = JSON.parse(JSON.stringify(dataMapList[index]));
                        let jsonArray = [];

                        if (exportConfiguration != null) {
                            //First Loop for Flat Fields to add data in columns
                            await this.enrichForFlatAndListButFlatFields(exportConfiguration, rowData);
                            //Loop for List Fields to create multiple rows
                            await this.enrichForListFields(exportConfiguration.columnLists, rowData, jsonArray);
                        }

                        if (jsonArray.length == 0) {
                            jsonArray.push(rowData);
                        }
                        let row = sheet.getRow(sheet.lastRow ? sheet.lastRow.number + 1 : 1);
                        for (let i = 0; i < jsonArray.length; i++) {
                            this.createRowInExcel(fieldTypeMapList, styles, column, jsonArray[i], row);
                        }                     
                    }
                }
                if (dataMapList.length < pageSize) {
                    break;
                } else {
                    pageNo++;
                }
            }
            
              

            try {
                fieldTypeMapList.forEach((field, columnPosition) => {
                    // Setting width, similar to your Java code which multiplies the width
                    sheet.getColumn(columnPosition + 1).width = 3 * (sheet.getColumn(columnPosition + 1).width || 10);
                });
            } catch (error) {
                console.error("Error while resizing columns in excel", error.message);
            }

            // Prepare a ByteArrayOutputStream equivalent in Node.js using a buffer
            const buffer = await workbook.xlsx.writeBuffer(); // Write workbook to buffer

            console.log('Excel report has been generated');
            
            return buffer; // Return the buffer, which is a byte array in Node.js

        } catch (error) {
            console.log('Error while printing report {}' + error.message);
            console.error(error.stack);
        }
        return null;
    }
    getFieldType(gridField, obj) {
        if (gridField.type) {
            switch (gridField.type.toLowerCase()) {
                case "text":
                case "dropdown":
                    obj.type = "string";
                    break;
                case "datetime":
                    obj.type = "date";
                    break;
                default:
                    obj.type = gridField.type;
                    break;
            }
        }
    }
    getStyle(fieldName, backGround, color, isHeader) {
        const bgColor = colorMap[backGround.get(fieldName)];
        const textColor = colorMap[color.get(fieldName)];
        return {
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb:  bgColor} // Use color map for background
          },
          font: {
            bold: isHeader,
            color: { argb:  textColor}, // Use color map for font
            size: 13
          },
          border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          },
          alignment: {
            wrapText: true
          }
        };
    }
    createRowInExcel(fieldTypeMapList, styles, column, jsonObject, row2) {
        let row = row2;
        fieldTypeMapList.forEach((field,i) => {
            column++;
            try {
                const fieldName = field.field;
                const getValueFromJson = field.getValueFromJson || true;
                const fieldType = field.type || "string";
                let fieldValue = null;
                if(getValueFromJson){
                    fieldValue = commonUtil.getValueFromJSONObject(jsonObject,fieldName);
                }else{
                    fieldValue = fieldName;
                }
                let style = styles.get(i + "_CELL")
                this.createCellInRow(column, row, fieldType, fieldValue,style);
                
            } catch (error) {
                console.error(error.stack);
                console.log("error while printing " + field.field)
            }
        });        
    }
    createCellInRow(column, row, fieldType, fieldValue,style){
        let value = fieldValue;
        switch (fieldType) {            
            case "number", "double", "int":
                value = commonUtil.getDecimalAmount(fieldValue);
                break;
            case "daterange", "date":
                const date = value;
                if(date && date.endsWith("T00:00:00.000Z")){
                    date = date.substring(0,10);
                }
                if(date.length == 10){
                    value = commonUtil.getDate(date);
                }else {
                    value = commonUtil.convertJsonStringToDate(fieldValue);
                }
                break;
            case "time":
                const datetime = commonUtil.changeStringDateToSpecificFormat(fieldValue, "MMM dd, yyyy, HH:mm:ss");
                value = commonUtil.convertDateToTime(datetime, "HH:mm a");
                break;
            case "reference_names":
            case "info":
                if (fieldValue && Array.isArray(fieldValue)) {
                    let stringBuilder = [];

                    for (let k = 0; k < fieldValue.length; k++) {
                        if (typeof fieldValue[k] === 'object' && fieldValue[k] !== null) {
                            // Check if fieldValue[k] is a JSONObject
                            if (fieldValue[k].name !== undefined && fieldValue[k].name !== null) {
                                stringBuilder.push(fieldValue[k].name);
                            }
                        } else {
                            stringBuilder.push(fieldValue[k]);
                        }
                    }
                    value = stringBuilder.join(',');
                }
                break;
            case "boolean":
                value = fieldValue ? "Yes" : "No";
                break;
            default:
                break;
        }
        // Create a cell in the current row and column
        const cell = row.getCell(column);
        cell.value = value;
        cell.style = style;
    }
    updateColumnInColumnTypeList(col,fieldTypeMapList,updated){
        for (const map of fieldTypeMapList) {
            if (map.field && map.field.toLowerCase() === col.columnValue.toLowerCase()) {
                updated = true;
                map.field = col.columnName;
                map.displayName = col.columnName;
                map.format = col.format;
                map.getValueFromJson = "false";
                map.type = col.columnType;
                break; // Exit the loop after updating
            }
        }
        if (!updated) {
            const map = {
                field: col.columnName,
                displayName: col.columnName,
                format: col.format,
                getValueFromJson: "false",
                type: col.columnType
            };
            fieldTypeMapList.push(map); // Adds the new object to the array
        }
    }
    async enrichForFlatAndListButFlatFields(exportConfiguration, jsonObject) {
        const columnLists = exportConfiguration?.columnLists || [];
        
        // Iterate over the columnLists array
        for (let ecIndex = 0; ecIndex < columnLists.length; ecIndex++) {
            const column = JSON.parse(JSON.stringify(columnLists[ecIndex]));
    
            // Check if columnType is 'flat'
            if (column.columnType && column.columnType.toLowerCase() === 'flat') {
                const query1 = await this.getQuery(column, jsonObject);
                if (query1) {
                    const obj1 = query1[0];
                    if (obj1) {
                        const str = JSON.stringify(obj1);
                        this.updateJsonObject(jsonObject, column, str, false);
                    }
                }
            } 
            // Check if columnType is 'list'
            else if (column.columnType && column.columnType.toLowerCase() === 'list') {
                if (column.columnValue && column.columnValue.toLowerCase() !== 'all') {
                    const query1 = await this.getQuery(column, jsonObject);
                    if (query1) {
                        const dataList = query1;
                        if (dataList && dataList.length > 0) {
                            const str = JSON.stringify(dataList);
                            this.updateJsonObject(jsonObject, column, str, true);
                        }
                    }
                }
            }
        }
    }
    async enrichForListFields(columnLists, jsonObject, jsonArray) {
        for (let ecIndex3 = 0; ecIndex3 < columnLists.length; ecIndex3++) {
            let columnList = columnLists[ecIndex3];
    
            if (columnList.columnType && columnList.columnType.toLowerCase() === 'list') {
                if (columnList.columnValue && columnList.columnValue.toLowerCase() === 'all') {
                    // Execute the query to get the data
                    let query1 = await this.getQuery(columnList, jsonObject);
    
                    if (query1 && query1.length > 0) {
                        let dataList = query1;
    
                        if (dataList && dataList.length > 0) {
                            let str = JSON.stringify(dataList);
    
                            if (str) {
                                let array = JSON.parse(str);
    
                                for (let i = 0; i < array.length; i++) {
                                    let clonedJsonObject = JSON.parse(JSON.stringify(jsonObject)); // Clone the JSON object
    
                                    columnList.columnList.forEach(columnList1 => {
                                        let value = commonUtil.getValueFromJSONObjectFromAnyLevel(array[i], columnList1.columnValue);
                                        // Parsing HTML to text (similar to Jsoup.parse)
                                        if (typeof value === 'string') {
                                            value = value.replace(/<\/?[^>]+(>|$)/g, ""); // Simple HTML stripping
                                        }
                                        clonedJsonObject[columnList1.columnName] = value;
                                    });
    
                                    jsonArray.push(clonedJsonObject);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    async getQuery(column,object){
        let query = [];
        let keyValuePair1 = {};
        keyValuePair1.value = column.collection;
        keyValuePair1.crList = [];
        if(column && column.searchCriteriaList && column.searchCriteriaList.length > 0){
            column.searchCriteriaList.forEach(criteria => {
                try {
                    let searchCriteria = new SearchCriteriaSchema();
                    searchCriteria.fName = criteria.fName;
                    searchCriteria.operator = criteria.operator;
                    searchCriteria.fValue = commonUtil.getValueFromJSONObjectFromAnyLevel(object, criteria.fValue).toString();
                    keyValuePair1.crList.push(searchCriteria);
                } catch (error) {
                    
                }
            });
        }
        queryHandler.enrichQuery(keyValuePair1.value.toLowerCase(), keyValuePair1, query);
        return query;
    }
    updateJsonObject(jsonObject, columnList, str, isListObject) {
        if (str && isListObject) {
            let array = JSON.parse(str); // Convert the string into a JSON array
            let jsonObject1 = {};
            jsonObject1[columnList.columnName.split('.')[0]] = array;
    
            columnList.columnList.forEach(columnList1 => {
                let value = commonUtil.getValueFromJSONObjectFromAnyLevel(jsonObject1, columnList1.columnValue);
                jsonObject[columnList1.columnName] = value;
            });
        } else if (str && !isListObject) {
            let jsonObject1 = JSON.parse(str); // Convert the string into a JSON object
    
            columnList.columnList.forEach(columnList1 => {
                if (jsonObject1.hasOwnProperty(columnList.columnValue)) {
                    let value = commonUtil.getValueFromJSONObjectFromAnyLevel(jsonObject1, columnList1.columnValue);
                    jsonObject[columnList1.columnName] = value;
                }
            });
        }
    }
}

module.exports = PrintReportHandler;