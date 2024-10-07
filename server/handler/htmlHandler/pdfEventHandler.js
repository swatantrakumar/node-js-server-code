const CommonUtils = require("../../utils/commonUtils");

const commonUtil = new CommonUtils();

class PdfEventHandler {
    constructor() {
        
    }

    populatePdfEventsValues = async (pdfEvents, object) => {
        const jsonObject = JSON.parse(JSON.stringify(object)); // Convert object to JSON object
        const finalObject = object; // Assign the final object
    
        if (pdfEvents && pdfEvents.length > 0) {
            for (const pdfEvent of pdfEvents) {
                try {
                    if (pdfEvent.enabled && pdfEvent.customText) {
                        const custommap = pdfEvent.customTextFields;
    
                        // Process each custom text field
                        Object.entries(custommap).forEach(([key, value]) => {
                            this.checkAndDisablePdfEventIfApplicable(finalObject, { key, value }, pdfEvent); // Assuming this function exists    
                            
                            if (pdfEvent.fieldType && pdfEvent.fieldType.toLowerCase() === "date") {
                                this.handleDateField(pdfEvent, finalObject, jsonObject, key, value);
                            } else if (pdfEvent.fieldType && pdfEvent.fieldType.toLowerCase() === "image") {
                                this.handleImageField(pdfEvent, finalObject, key, value);
                            } else if (pdfEvent.fieldType && pdfEvent.fieldType.toLowerCase() === "imagebytes") {
                                this.handleImageBytesField(pdfEvent, finalObject, key, value);
                            } else {
                                this.handleOtherFields(pdfEvent, finalObject, key, value);
                            }
                            
                        });
                    }
                    this.handlePdfTable(jsonObject, finalObject, pdfEvent); // Assuming this function exists
                } catch (error) {
                    console.error("Error while parsing pdfEvent:", error.message);
                }
            }
        }
    };
    
    // Function to handle date fields
    handleDateField = (pdfEvent, finalObject, jsonObject, key, value) => {
        let date = null;
        try {
            const propValue = finalObject[value];
            if (propValue) {
                if (!propValue.includes("T")) {
                    date = commonUtil.changeStringDateToSpecificFormat(jsonObject[value], "yyyy-MM-dd'T'HH:mm:ss"); 
                } else {
                    date = commonUtil.convertMilliSecondToDate(parseInt(propValue));
                }
            }
        } catch (error) {
            if (jsonObject.hasOwnProperty(value) && jsonObject[value]) {
                date = commonUtil.convertMilliSecondToDate(parseInt(jsonObject[value]));
            }
            console.error("Invalid Date:", key);
        }
    
        if (date) {
            pdfEvent.text = pdfEvent.text.replace(new RegExp(key, 'g'), this.getText(commonUtil.convertDateToStandardDateTimeWithFormat(date, pdfEvent.fieldFormat || "dd-MM-yyyy"), pdfEvent.defaultText)); // Assuming getText exists
        } else {
            pdfEvent.text = pdfEvent.text.replace(new RegExp(key, 'g'), this.getText("", pdfEvent.defaultText));
        }
    };
    
    // Function to handle image fields
    handleImageField = (pdfEvent, finalObject, key, value) => {
        try {
            const propValue = finalObject[value];
            pdfEvent.url = propValue ? pdfEvent.url.replace(new RegExp(key, 'g'), propValue) : pdfEvent.url.replace(new RegExp(key, 'g'), "");
        } catch (error) {
            console.error("Invalid Image:", key);
        }
    };
    
    // Function to handle image bytes fields
    handleImageBytesField = (pdfEvent, finalObject, key, value) => {
        try {
            const data = finalObject[value];
            if (pdfEvent.url && pdfEvent.url.includes(key)) {
                pdfEvent.url = data || pdfEvent.url; // Maintain previous URL if no data
            } else if (data) {
                const imageData = data.toString();
                if (imageData.length > 15) {
                    pdfEvent.imageBytes = Base64.decode(imageData.substring(16));
                }
            } else {
                pdfEvent.enabled = false; // Assuming pdfEvent has an enabled field
            }
        } catch (error) {
            console.error("Invalid Field:", key);
        }
    };
    
    // Function to handle other field types
    handleOtherFields = (pdfEvent, finalObject, key, value) => {
        try {
            let propValue = null;
            if (key.toLowerCase() === "enable_if") {
                if (value) {
                    const operation = parseInt(value.charAt(0));
                    propValue = this.checkEnabledAndReturnValue(operation, propValue, finalObject, { key, value }, pdfEvent); // Assuming this function exists
                } else {
                    pdfEvent.enabled = false;
                }
            }
    
            const fieldValue = get(finalObject, value);
            if (pdfEvent.text) {
                pdfEvent.text = pdfEvent.text.replace(new RegExp(key, 'g'), this.getText(fieldValue, pdfEvent.defaultText)); // Assuming getText exists
            } else if (fieldValue) {
                pdfEvent.text = fieldValue;
            }
        } catch (error) {
            try {
                pdfEvent.text = pdfEvent.text.replace(new RegExp(key, 'g'), this.getText("", pdfEvent.defaultText)); // Assuming getText exists
            } catch (ex) {
                console.error("Invalid Field:", key);
            }
        }
    };
    getText(str, defaultText) {
        if (str && str.trim() !== "") {
            return str;
        } else if (defaultText && defaultText.trim() !== "") {
            return defaultText;
        } else {
            return "";
        }
    }
    checkAndDisablePdfEventIfApplicable(finalObject, entry, pdfEvent) {
        try {
            if (entry.key.toLowerCase() === "enable_if") {
                if (entry.value.trim() !== "") {
                    const operation = parseInt(entry.value.charAt(0), 10);
                    let value = null;
                    this.checkEnabledAndReturnValue(operation, value, finalObject, entry, pdfEvent);
                } else {
                    pdfEvent.enabled = false;
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
    checkEnabledAndReturnValue(operation, value, finalObject, entry, pdfEvent) {
        try {
            switch (operation) {
                case 33: // Not True (!)
                    value = this.getProperty(finalObject, entry.value.substring(1));
                    this.checkEnabled(value === "N" || value === "No" || value === "False", pdfEvent);
                    break;
    
                case 61: // Equal (=)
                    value = this.getProperty(finalObject, entry.value.substring(1));
                    this.checkEnabled(value === "Y" || value === "Yes" || value === "True" || value === true, pdfEvent);
                    break;
    
                default:
                    value = this.getProperty(finalObject, entry.value);
                    this.checkEnabled(value === "Y" || value === "Yes" || value === true, pdfEvent);
                    break;
            }
        } catch (e) {
            pdfEvent.enabled = false;
        }
        return value;
    }
    checkEnabled(value1, pdfEvent) {
        pdfEvent.enabled = value1; // Set enabled to true or false based on value1
    }
    getProperty(obj, property) {
        return obj[property]; // Adjust this based on how you access properties
    }
    handlePdfTable(jsonObject, finalObject, pdfEvent) {
        if (pdfEvent.table) {
            if (pdfEvent.table.rows) {
                pdfEvent.table.rows.forEach(row => {
                    if (row.cells) {
                        row.cells.forEach(cell => {
                            if (cell.customTextFields) {
                                const type = cell.fieldType;
                                const fieldFormat = cell.fieldFormat;
                                const customMap = cell.customTextFields;
    
                                if (customMap) {
                                    Object.entries(customMap).forEach(([key, value]) => {
                                        switch (type) {
                                            case "date":
                                                let date = null;
                                                try {                                                    
                                                    let fieldValue = this.getProperty(finalObject, value);
                                                    if (fieldValue) {
                                                        if (fieldValue.indexOf("T") !== 1) {
                                                            date = commonUtil.changeStringDateToSpecificFormat(jsonObject[value], "yyyy-MM-dd'T'HH:mm:ss");
                                                        } else {
                                                            date = commonUtil.convertMilliSecondToDate(Number(fieldValue));
                                                        }
                                                    }
                                                } catch (e) {
                                                    if (jsonObject.hasOwnProperty(value) && jsonObject[value]) {
                                                        date = commonUtil.convertMilliSecondToDate(Number(jsonObject[value]));
                                                    }
                                                    console.error("Invalid Date: " + key);
                                                    console.error(e);
                                                }
    
                                                if (date) {
                                                    cell.text = cell.text.replace(new RegExp(key, 'g'), this.getText(commonUtil.convertDateToStandardDateTimeWithFormat(date, fieldFormat || "dd-MM-yyyy"), cell.defaultText));
                                                } else {
                                                    cell.text = cell.text.replace(new RegExp(key, 'g'), this.getText("", cell.defaultText));
                                                }
                                                break;    
                                            case "image":
                                            case "imageBytes":
                                                try {
                                                    let fieldValue = this.getProperty(finalObject, value);
                                                    if (key.toLowerCase() === "enable_if") {
                                                        if (!Boolean(fieldValue)) {
                                                            row.enabled = false;
                                                        }
                                                    } else {
                                                        if (cell.url && cell.url.includes(key)) {
                                                            if (fieldValue) {
                                                                cell.url = fieldValue;
                                                            } else if (type === "imageBytes") {
                                                                cell.imageBytes = fieldValue ? Buffer.from(fieldValue) : null; // Assuming imageBytes should be a Buffer
                                                            }
                                                        }
                                                    }
                                                } catch (e) {
                                                    console.error("Invalid Field: " + key);
                                                    console.error(e);
                                                }
                                                break;
    
                                            default:
                                                try {
                                                    let fieldValue = this.getProperty(finalObject, value);
                                                    if (key.toLowerCase() === "enable_if") {
                                                        if (!Boolean(fieldValue)) {
                                                            row.enabled = false;
                                                        }
                                                    } else {
                                                        cell.text = cell.text.replace(new RegExp(key, 'g'), this.getText(fieldValue, cell.defaultText));
                                                    }
                                                } catch (e) {
                                                    cell.text = cell.text.replace(new RegExp(key, 'g'), this.getText("", cell.defaultText));
                                                    console.error(e);
                                                }
                                                break;
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    }
}
module.exports = PdfEventHandler;