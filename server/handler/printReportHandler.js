const Operators = require("../enum/operator");
const GridConfigDetails = require("../model/builder/gridConfigDetails");
const CommonUtils = require("../utils/commonUtils");
const CollectionHandler = require("./collectionHandler");
const templateHandler = require("../handler/templateHandler");
const ExcelJS = require('exceljs');
const colorMap = require("../enum/colorMap");

const collectionHandler = new CollectionHandler();
const commonUtil = new CommonUtils();

class PrintReportHandler {
    async createReport(tabName,object){
        let pageSize = 75;
        let pageNo = 0;

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

        for (let index = 0; index < fieldTypeMapList.length; index++) {
            const field = fieldTypeMapList[index];
            const fieldName = field.field;
            const displayName = field.displayName;
            const type = field.type;

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
              
                const fieldName = field.displayName;
                const fieldType = field.type;
                const fieldFormat = field.format;
              
                // Create a cell in the current row and column
                const cell = row.getCell(column);
                cell.value = fieldName;
              
                // Apply header style
                styles.set(fieldName + "_HEADER", this.getStyle(fieldName,headerBackGround,headerColor, true));
                cell.style = styles[fieldName + "_HEADER"];
              
                // Set up cell styles for data rows (not header)
                styles.set(i + "_CELL", this.getStyle(fieldName,rowBackGround,rowColor, true));
              
                if (fieldType === 'date' || fieldType === 'daterange') {
                  styles.get(i + "_CELL").numFmt = fieldFormat || 'dd-mmm-yyyy'; // Default date format
                }             
                
              });
              
              // Add the row to the sheet
              sheet.addRow(row);

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
        return {
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colorMap[backGround[fieldName]] } // Use color map for background
          },
          font: {
            bold: isHeader,
            color: { argb: colorMap[color[fieldName]] }, // Use color map for font
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
}

module.exports = PrintReportHandler;