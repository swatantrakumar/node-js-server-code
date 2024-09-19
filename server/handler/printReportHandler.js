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
            exportConfiguration = null;
        } catch (error) {
            exportConfiguration = null;
        }

        if (exportConfiguration != null) {}

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

            // let clazz = reportHandler.getClass(keyValuePair.value);
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
            dataMapList = await collectionHandler.findAllDocumentsWithListQueryCriteria(clazz,criteriaList,null,pageNo,pageSize,columnsName);
            // let list = JSON.parse(JSON.stringify(data));

            if(dataMapList && dataMapList.length > 0){
                for (let index = 0; index < dataMapList.length; index++) {
                    column = 0;
                    const rowData = JSON.parse(JSON.stringify(dataMapList[index]));
                    let row = sheet.getRow(sheet.lastRow ? sheet.lastRow.number + 1 : 1);
                    this.createRowInExcel(fieldTypeMapList, styles, column, rowData, row); 
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
                // const datetime = commonUtil.changeStringDateToSpecificFormat(fieldValue, "MMM dd, yyyy, HH:mm:ss");
                // value = commonUtil.convertDateToTime(datetime, "HH:mm a");
                break;
            case "reference_names":
            case "info":
                // if (fieldValue && Array.isArray(fieldValue)) {                     
                //     StringBuilder stringBuilder = new StringBuilder();
                //     for (int k = 0; k < jsonArray.length(); k++) {
                //         if (jsonArray.get(k) instanceof JSONObject) {
                //             if (!jsonArray.getJSONObject(k).isNull("name")) {
                //                 stringBuilder.append(jsonArray.getJSONObject(k).getString("name") + ",");
                //             }
                //         } else {
                //             stringBuilder.append(jsonArray.getString(k) + ",");
                //         }
                //     }
                //     value = stringBuilder.toString();
                //     if(row.getCell(column).getStringCellValue().length()>1){
                //         row.getCell(column).setCellValue(row.getCell(column).getStringCellValue().substring(0,row.getCell(column).getStringCellValue().length()-1));
                //     }
                // }
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
}

module.exports = PrintReportHandler;