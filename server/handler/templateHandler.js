const ApplicationSetting = require("../model/generic/applicationSetting");
const CollectionHandler = require("./collectionHandler");
const cacheService = require('../cache/cacheService');

const collectionHandler = new CollectionHandler();

class TemplateHandler{
    async prepareTemplates(){
        await this.prepareFieldWiseTemplates();
    }
    async prepareFieldWiseTemplates(){
        await this.fetchCommonModuleListFromDb();
    }
    async fetchCommonModuleListFromDb () {
        const applicationSettings =  await collectionHandler.findAllDocuments(ApplicationSetting);
        const commonModuleListFromDb = new Set();
        if(applicationSettings && applicationSettings.length > 0) {
            applicationSettings.forEach(applicationSetting => {
                const commonModules = applicationSetting.commonModuleList;
                if (commonModules && commonModules.length > 0) {
                    commonModules.forEach(module => {
                        commonModuleListFromDb.add(module);
                    })
                }
            });
            if (commonModuleListFromDb && commonModuleListFromDb.length > 0) {
                commonModuleListFromDb.forEach(moduleName =>{
                    cacheService.coreModuleList.add(moduleName);
                })
            }
            console.log("get module list from applicatoin setting !!!")
        }
    }
    getCoreModuleList() {
        return cacheService.coreModuleList;
    }
    getMenuWithSubMenuListForCentral(){
        return [];
    }
}

module.exports = TemplateHandler;