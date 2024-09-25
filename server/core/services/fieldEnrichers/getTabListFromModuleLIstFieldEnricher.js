const Operators = require("../../../enum/operator");
const CollectionHandler = require("../../../handler/collectionHandler");
const QueryCriteria = require("../../../handler/queryHandler/queryCriteria");
const ProjectModules = require("../../../model/builder/projectModules");
const templateHandler = require('../../../handler/templateHandler');
const CommonUtils = require("../../../utils/commonUtils");
const Menu = require("../../../model/builder/menu");
const Template = require("../../../model/builder/template");
const TemplateTab = require("../../../model/builder/templateTab");
const Reference = require("../../../model/reference");
const AppResourceModule = require("../../../model/permission/appResourceModule");
const AppResourceMenu = require("../../../model/permission/appResourceMenu");
const AppResourceTemplateTab = require("../../../model/permission/appResourceTemplateTab");


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
    prepareAppResourceModule(projectModules,  menuList,  templateList,  templateTabMap,  modules){
        let moduleName = projectModules.name;
        let menuListForModule = menuList.filter(menu => menu.module_name && menu.module_name.toLowerCase() == moduleName.toLowerCase());
        let appModule = new AppResourceModule();
        let referenceModule = new Reference();
        referenceModule['_id'] = projectModules._id;
        referenceModule['name'] = projectModules.name;
        appModule['reference'] = referenceModule;
        let menus = new Map();
        let menuCount = 0;
        for (const menu of menuListForModule) {
            let menuName = menu.name;
            let submenuName = null;
            let appMenu = new AppResourceMenu() ;

            let reference = new Reference() ;
            reference['_id'] = menu._id;
            reference['name'] = menuName;
            appMenu['reference'] = reference;
            if(menu && menu.submenu && menu.submenu.length > 0){
                let submenuList = menu.submenu;
                appMenu['templateTabs'] = null;
                let subMenus = new Map();
                for (const submenu of submenuList) {
                    submenuName = submenu.name;
                    let tabList = this.getTabListFromMenu(templateList, submenuName , templateTabMap); 
                    let appSubMenu = new AppResourceMenu() ;

                    let referenceSubMenu = new Reference() ;
                    referenceSubMenu['_id'] = submenu._id;
                    referenceSubMenu['name'] = submenu.name;
                    appSubMenu['reference'] = referenceSubMenu;
                    appSubMenu['submenus'] = null;
                    
                    if(tabList && tabList.length > 0){
                        appSubMenu['templateTabs'] = this.prepareTabMapFromTabList(tabList);                        
                        subMenus.set(appSubMenu.reference.name, appSubMenu);                        
                    }
                }
                appMenu['submenus'] = subMenus;
            }else{                
                let tabList = this.getTabListFromMenu(templateList, menuName , templateTabMap);
                appMenu['submenus'] = null;                
                if(tabList && tabList.length > 0){                    
                    appMenu['templateTabs'] = this.prepareTabMapFromTabList(tabList); 
                }
            }
            if((appMenu.submenus && appMenu.submenus.size > 0) || (appMenu.templateTabs && appMenu.templateTabs.size > 0)){
                menus.set(menuName, appMenu) ;
            } else {
                menuCount++ ;
            }
        }
        appModule.menus = menus;
        if ( menuListForModule.length != menuCount ){
            if (appModule.reference && appModule.reference.name){
                let modulesKey = appModule.reference.name + " ( " + projectModules.title + " )" ;
                modules.set(modulesKey , appModule) ;
            }
        }

    }
    getTabListFromMenu(){
        
    }
    prepareTabMapFromTabList(tabList){
        let templateTabs = new Map();
        for (const reference1 of tabList) {
            let appTemplateTab = new AppResourceTemplateTab() ;
            appTemplateTab['reference'] = reference1;
            if (appTemplateTab.reference && appTemplateTab.reference.name){
                templateTabs.set( appTemplateTab.reference.name,appTemplateTab) ;
            }
        }
        return templateTabs;
    }
}

// Export the class or module
module.exports = new GetTabListFromModuleLIstFieldEnricher();
