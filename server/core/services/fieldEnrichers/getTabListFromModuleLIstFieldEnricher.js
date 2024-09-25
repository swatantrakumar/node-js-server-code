const Operators = require("../../../enum/operator");
const CollectionHandler = require("../../../handler/collectionHandler");
const QueryCriteria = require("../../../handler/queryHandler/queryCriteria");
const ProjectModules = require("../../../model/builder/projectModules");
const templateHandler = require('../../../handler/templateHandler');
const CommonUtils = require("../../../utils/commonUtils");
const Menu = require("../../../model/builder/menu");
const Template = require("../../../model/builder/template");
const TemplateTab = require("../../../model/builder/templateTab");


const collectionHandler = new CollectionHandler();
const commonUtil = new CommonUtils();
// Define the GetTabListFromModuleLIstFieldEnricher class or module
class GetTabListFromModuleLIstFieldEnricher {
    // The execute method should match the signature from where it's called
    // You can adjust the parameters as needed for your business logic
    async execute(applicationUser, result, kvp) {

        let objectList = [];
        let callBackField = kvp.key3 ? kvp.key3 : 'collection_list';
        try {
            let moduleList = await collectionHandler.findAllDocuments(ProjectModules,commonUtil.getSelectColumns(["_id","name","title" ,"imgPath" ,"menu_list" , "mouseHover" , "description" , "status" , "appId" , "refCode"]),[new QueryCriteria("name","string",Operators.NOT_IN,templateHandler.getCoreModuleList())]);

            let menuList = await collectionHandler.findAllDocuments(Menu,commonUtil.getSelectColumns(["_id","name","label","module_name","submenu"]),[new QueryCriteria("module_name","string",Operators.NOT_IN,templateHandler.getCoreModuleList())]);

            let templateList = await collectionHandler.findAllDocuments(Template,commonUtil.getSelectColumns(["_id","name","label","tabs"]));

            let templateTabList = await collectionHandler.findAllDocuments(TemplateTab,commonUtil.getSelectColumns(["_id","name","label"]));

            let templateTabMap = new Map();
            for (const templateTab of templateTabList) {
                if (templateTab && templateTab._id) {
                    templateTabMap.set(templateTab._id, templateTab);
                }
            }
            let modules = new Map();
            for (const projectModules of moduleList) {
                if ( projectModules.status == null || projectModules.status == "InActive"){
                    continue ;
                }
                this.prepareAppResourceModule(projectModules, menuList, templateList, templateTabMap, modules);
            }

        } catch (error) {
            
        }

    }
}

// Export the class or module
module.exports = new GetTabListFromModuleLIstFieldEnricher();
