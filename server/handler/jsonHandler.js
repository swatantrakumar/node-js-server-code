const CommonUtils = require("../utils/commonUtils");

const commonUtil = new CommonUtils();

class JsonHandler {
    // Utility function to get a unique list based on a field in a JSON array
    async getUniqueList(array, field) {
        const pickedItems = new Map();  // To store unique values
        const newArray = [];

        for (let i = 0; i < array.length; i++) {
            try {
                const item = array[i];
                let pickedValue = null;

                // If the field is provided, get the value from the nested object
                if (field && field !== "") {
                    pickedValue = commonUtil.getValueFromJSONObjectFromAnyLevel(item, field);
                }

                // If pickedValue is not null and is unique, add it to the newArray
                if (pickedValue !== null && !pickedItems.has(pickedValue)) {
                    pickedItems.set(pickedValue, "done");
                    newArray.push(pickedValue);
                }
            } catch (e) {
                console.error(`Error processing item at index ${i}: ${e.message}`);
            }
        }

        return newArray;
    }
}

module.exports = JsonHandler;