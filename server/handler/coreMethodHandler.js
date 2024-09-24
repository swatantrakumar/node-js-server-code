const redisCacheService = require('../cache/redisCacheService');
const templateHandler = require('../handler/templateHandler');
const FieldEnricherProperties = require('../model/generic/fieldEnricherProperties');

class CoreMethodHandlers{
    async processQueryTempalte(result, employee, kvp, resultList, sub_result, values, value){
        let fieldEnricherProperties = null;
        let moduleName = kvp?.module;
        if(kvp && values.length >= 0 && moduleName && templateHandler.getCoreModuleList() && templateHandler.getCoreModuleList().includes(moduleName)){
            fieldEnricherProperties = templateHandler.getFieldEnricherPropertiesFromCentral(values[1]);
            if(fieldEnricherProperties == null){
                fieldEnricherProperties = await redisCacheService.getDataFromCacheOrCollection(FieldEnricherProperties,values[1],'key',['key','method','classNameWithPath']);
            }
        }else {
            fieldEnricherProperties = await redisCacheService.getDataFromCacheOrCollection(FieldEnricherProperties,values[1],'key',['key','method','classNameWithPath']);
        }

        if (fieldEnricherProperties == null) {
            fieldEnricherProperties = templateHandler.getFieldEnricherPropertiesFromCentral(values[1]);
        }
        if(fieldEnricherProperties == null){
            fieldEnricherProperties = new FieldEnricherProperties();
            fieldEnricherProperties.setClassNameWithPath("core/services/fieldEnrichers/RunFromDynamicFieldEnricher");
            fieldEnricherProperties.setMethod("execute_with_template_name");
            fieldEnricherProperties.setKey("RUN_FROM_DYNAMIC");
        }
        try {
            let classPath = fieldEnricherProperties.classNameWithPath;
            let method = fieldEnricherProperties.method;
            console.log("class Path : -" + classPath);
            console.log("Method : -" + method);
        } catch (error) {
            console.error(error.stack);
        }
    }
}

module.exports = new CoreMethodHandlers();