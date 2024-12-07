const templateHandler = require('../handler/templateHandler');
const FieldEnricherProperties = require('../model/generic/fieldEnricherProperties');
const CollectionHandler = require('./collectionHandler');

const collectionHandler = new CollectionHandler();

class CoreMethodHandlers{
    async processQueryTempalte(result, employee, kvp, resultList, sub_result, values, value){
        let fieldEnricherProperties = null;
        let moduleName = kvp?.module;
        if(kvp && values.length >= 0 && moduleName && templateHandler.getCoreModuleList() && templateHandler.getCoreModuleList().includes(moduleName)){
            fieldEnricherProperties = templateHandler.getFieldEnricherPropertiesFromCentral(values[1]);
            if(fieldEnricherProperties == null){
                fieldEnricherProperties = await collectionHandler.findDocument(FieldEnricherProperties,'key',values[1]);
            }
        }else {
            fieldEnricherProperties = await collectionHandler.findDocument(FieldEnricherProperties,'key',values[1]);
        }

        if (fieldEnricherProperties == null) {
            fieldEnricherProperties = templateHandler.getFieldEnricherPropertiesFromCentral(values[1]);
        }
        if(fieldEnricherProperties == null){
            fieldEnricherProperties = new FieldEnricherProperties();
            fieldEnricherProperties.classNameWithPath = "core/services/fieldEnrichers/RunFromDynamicFieldEnricher";
            fieldEnricherProperties.method = "execute_with_template_name";
            fieldEnricherProperties.key = "RUN_FROM_DYNAMIC";
        }
        try {
            let modulePath = '../' + fieldEnricherProperties.classNameWithPath;
            let method = fieldEnricherProperties.method;
            let methodName = "execute";
            let loadedClass;
            try {
                loadedClass = require(modulePath);
            } catch (error) {
                console.error(`Failed to load module: ${modulePath}`, error);
                return;
            }

            if (typeof loadedClass[methodName] === 'function') {       
                try {
                    switch (method) {
                        case "all":
                            await loadedClass[methodName](employee, result, kvp, resultList, sub_result, values, value);
                            break;  
                        case "execute_with_template_name":
                            await loadedClass[methodName](employee,values[1], result, kvp);
                            break;
                        case "execute_map_keyvalue":
                            await loadedClass[methodName](result, kvp);
                            break;
                        case "execute":
                            await loadedClass[methodName]();
                            break;
                        case "execute_appuser_map_keyvalue":
                        case "execute_with_resultList_subList_values_value" :                                              
                        default:
                            await loadedClass[methodName](employee, result, kvp);
                            break;
                    }
                } catch (error) {
                    console.error(`Error executing method: ${methodName}`, error);
                }

            }
            
        } catch (error) {
            console.error(error.stack);
        }
        // let endTime = System.currentTimeMillis();
        // collectionHandler.saveQueryLog(values[1], kvp.getCrList().toString(), startTime, endTime,0);
    }
}

module.exports = new CoreMethodHandlers();