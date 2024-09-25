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
            let modules = {};
            for (const projectModules of moduleList) {
                if ( !projectModules.status || projectModules.status == "InActive"){
                    continue ;
                }
                this.prepareAppResourceModule(projectModules, menuList, templateList, templateTabMap, modules);
            }

            // let projectModuleMapForCentral = templateHandler.getProjectModuleMapForCentral();
            // let menuListForCentral = templateHandler.getMenuListWithSubMenuForCentral();
            // let templateMapForCentral = templateHandler.getTemplateMapForCentral();
            // let tabMapForCentral = templateHandler.getTabMapForCentral();

            // const templateListForCentral = Object.values(templateMapForCentral);
            // for (const projectModule of Object.values(projectModuleMapForCentral)) {
            //     this.prepareAppResourceModule(projectModule, menuListForCentral, templateListForCentral, tabMapForCentral, modules);
            // }            
            objectList.push(commonUtil.getResultChildObject(callBackField, modules));

            const list = ["menus", "submenus", "templateTabs"];
            objectList.push(commonUtil.getResultChildObject("keys", list));

        } catch (error) {
            console.error(error.stack)
        }
        if (Array.isArray(result.get('success'))) {
            result.get('success').push(...objectList);
        }

    }
    prepareAppResourceModule(projectModules,  menuList,  templateList,  templateTabMap,  modules){
        let moduleName = projectModules.name;
        let menuListForModule = menuList.filter(menu => menu.module_name && menu.module_name.toLowerCase() == moduleName.toLowerCase());
        let appModule = {};
        let referenceModule = {};
        referenceModule['_id'] = projectModules._id;
        referenceModule['name'] = projectModules.name;
        appModule['reference'] = referenceModule;
        let menus = {};
        let menuCount = 0;
        for (const menu of menuListForModule) {
            let menuName = null;
            let submenuName = null;
            let appMenu = {};

            let reference = {};
            reference['_id'] = menu._id;
            reference['name'] = menu.label;
            appMenu['reference'] = reference;
            if(menu && menu.submenu && menu.submenu.length > 0){
                let submenuList = menu.submenu;
                appMenu['templateTabs'] = null;
                let subMenus = {};
                for (const submenu of submenuList) {
                    submenuName = submenu.name;
                    let tabList = this.getTabListFromMenu(templateList, submenuName , templateTabMap); 
                    let appSubMenu = {};

                    let referenceSubMenu = {};
                    referenceSubMenu['_id'] = submenu._id;
                    referenceSubMenu['name'] = submenu.label;
                    appSubMenu['reference'] = referenceSubMenu;
                    appSubMenu['submenus'] = null;
                    
                    if(tabList && tabList.length > 0){
                        appSubMenu['templateTabs'] = this.prepareTabMapFromTabList(tabList);                        
                        subMenus[appSubMenu.reference.name] = appSubMenu;                        
                    }
                }
                appMenu['submenus'] = subMenus;
            }else{  
                menuName = menu.name;              
                let tabList = this.getTabListFromMenu(templateList, menuName , templateTabMap);
                appMenu['submenus'] = null;                
                if(tabList && tabList.length > 0){                    
                    appMenu['templateTabs'] = this.prepareTabMapFromTabList(tabList); 
                }
            }
            if((appMenu.submenus && Object.keys(appMenu.submenus).length > 0) || (appMenu.templateTabs && Object.keys(appMenu.templateTabs).length > 0)){
                menus[appMenu.reference.name] = appMenu ;
            } else {
                menuCount++ ;
            }
        }
        appModule.menus = menus;
        if ( menuListForModule.length != menuCount ){
            if (appModule.reference && appModule.reference.name){
                let modulesKey = appModule.reference.name + " ( " + projectModules.title + " )" ;
                modules[modulesKey] = appModule;
            }
        }

    }
    getTabListFromMenu(templateList , menuName , templateTabMap){
        let tabs = [];
        const temp = templateList.find(template => template.name && template.name.toLowerCase() === menuName.toLowerCase());
        if (temp && temp.tabs && temp.tabs.length > 0) {
            const tabList = temp.tabs;
        
            tabList.forEach(tab => {
                const templateTab = templateTabMap.get(tab._id);
                if (templateTab && templateTab.label) {
                    tab.name = templateTab.label;  
                }
                tabs.push(JSON.parse(JSON.stringify(tab)));  
            });
        }
        return tabs;
    }
    prepareTabMapFromTabList(tabList){
        let templateTabs = {};
        for (const reference1 of tabList) {
            let appTemplateTab = {};
            appTemplateTab['reference'] = reference1;
            if (appTemplateTab.reference && appTemplateTab.reference.name){
                templateTabs[appTemplateTab.reference.name] = appTemplateTab;
            }
        }
        return templateTabs;
    }
}

// Export the class or module
module.exports = new GetTabListFromModuleLIstFieldEnricher();
