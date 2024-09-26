const CollectionHandler = require("./collectionHandler");
const AppRoleBinding = require("../model/permission/appRoleBinding");
const AppUsersGroup = require("../model/permission/appUsersGroup");
const AppGroupOfGroup = require("../model/permission/appGroupOfGroup");
const ApplicationUser = require("../model/permission/applicationUser");
const AppRole = require("../model/permission/appRole");
const CommonUtils = require("../utils/commonUtils");
const cacheService = require('../cache/cacheService');
const TemplateTab = require("../model/builder/templateTab");
const templateHandler = require("./templateHandler");
const ProjectModules = require("../model/builder/projectModules");
const Menu = require("../model/builder/menu");
const Template = require("../model/builder/template");
const UserPreference = require("../model/permission/userPreference");
const Operators = require("../enum/operator");
const QueryCriteria = require("./queryHandler/queryCriteria");
const AppActions = require("../model/permission/appActions");

const collectionHandler = new CollectionHandler();
const commonUtil = new CommonUtils();
const keyExtractor = obj => obj.id;
const keyNameExtractor = obj =>obj.name;
let mongoChart = false;
let favouriteMenuAndSubMenuIds;

class PermissionHandler{
    
    async getPermissionLists(user,result,roleName){
        const modules = new Map();
        const templateTabIdSet = new Set();
        const fevouriteTemplateTabIdSet = new Set();
        mongoChart = false;
        
        try {
            // Get userId from current user
            const userid = user.appId + "#" + user.refCode + "#" + user._id;

            if (cacheService.userIdWithAppRoleIds.has(userid)) {
                // Create arrays and maps
                const menuListWithSubMenu = [];
                const menuMapWithSubMenuMap = new Map();
                const menuList = [];
                const menuMap = new Map();
                const subMenuList = [];
                const subMenuMap = new Map();
                const templateList = [];
                const templateMap = new Map();
                const templateTabList = [];
                const templateTabMap = new Map();
                const projectModuleMap = new Map(); 

                // Fetching all TemplateTab From DB well from central env. at the starting of application
                await this.getMergedTemplateTabDataWithCentral(templateTabList, templateTabMap);

                // Fetching the module list from DB well from central env. and convert to map
                await this.getMergedProjectModuleDataWithCentral(projectModuleMap);

                // Fetching the MenuListWithSubMenu list from DB as well from central env. and convert to map
                await this.getMergedMenuWithSubMenuWithCentral(menuListWithSubMenu, menuMapWithSubMenuMap, subMenuList, subMenuMap);

                // Fetching the MenuList list from DBas well from central env. and convert to map
                await this.getMergedMenuWithCentral(menuMap, menuList);

                // Fetching the Template list from DB as well from central env. and convert to map
                await this.getMergedTemplateWithCentral(templateList, templateMap);

                let appRoleList = await this.getAppRoles(userid);
                const roleList = this.prepareRollList(appRoleList);
                result["rollList"] = roleList;
                if(roleName){
                    let roleListByRoleName = [];
                    if(appRoleList && Array.isArray(appRoleList) && appRoleList.length > 0){
                        for (let i = 0; i < appRoleList.length; i++) {
                            const role = appRoleList[i];
                            if(role && role.name === roleName){
                                roleListByRoleName.push(role)
                                break;
                            }                            
                        }
                    }
                    if(roleListByRoleName &&  roleListByRoleName.length > 0){
                        appRoleList = roleListByRoleName;
                    }
                }
                const menuSubMenuIds = new Set();
                const tabNameWithPermissionActionsMap = new Map();
                favouriteMenuAndSubMenuIds = new Set();
                let booleanFlag = false;
                const userPreference = await collectionHandler.findAllDocumentsWithListQueryCriteria(UserPreference, [QueryCriteria.createWithFieldOperatorAndValue('userId._id', Operators.EQUAL, user._id)], "index", 0, 0);
                const favouriteMenus = new Map();
                if (userPreference  && Array.isArray(userPreference) && userPreference.length > 0){
                    console.log("userprefrence");
                    // populateFavouriteModuleForUserPreference(favouriteMenus, userPreference.get(0));
                } 
                if (favouriteMenus.size > 0) {
                    // prepareMyFavorite(favouriteMenus, tabNameWithPermissionActionsMap, modules, menuMap, subMenuMap, templateTabMap, menuMapWithSubMenuMap, templateMap, menuSubMenuIds, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet);
                }
                booleanFlag = true;
                if (appRoleList && Array.isArray(appRoleList) && appRoleList.length > 0) {
                    appRoleList.forEach(appRole => {
                        const appResourceModuleTreeMap = appRole.appResourceList;
                        if (appResourceModuleTreeMap && appResourceModuleTreeMap.size > 0) {
                            this.getModuleMasterObjectAndProcess(appRole, appResourceModuleTreeMap, modules, tabNameWithPermissionActionsMap, projectModuleMap, menuMap, subMenuMap,templateTabMap, menuMapWithSubMenuMap, menuListWithSubMenu, templateTabIdSet, templateMap, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet);
                        }
                    });
                }
                // console.log(modules); 
                if (modules.size > 0 && favouriteMenus.size > 0) {
                    booleanFlag = false;
                    // prepareMyFavorite(favouriteMenus, tabNameWithPermissionActionsMap, modules, menuMap, subMenuMap, templateTabMap, menuMapWithSubMenuMap, templateMap, menuSubMenuIds, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet);
                }
                // console.log(modules);
                const finalPermission = commonUtil.mapToObj(modules)
                result["permission"] = finalPermission;
                
                // this.mapToObj(modules);
                // console.log(finalPermission);
                console.timeLog('getPermission','validateToken request received.');
            }
        } catch (error) {
            console.log(error);
        }
        if (templateTabIdSet.size > 0){
            cacheService.userIdWithTemplateTabIdMap.set(user._id, templateTabIdSet);
        }
        if (fevouriteTemplateTabIdSet.size > 0){
            cacheService.userIdWithFevouriteTemplateTabIdMap.set(user._id, fevouriteTemplateTabIdSet);
        }
    }
    
    getModuleMasterObjectAndProcess(appRole, appResourceModuleTreeMap, modules, tabNameWithPermissionActionsMap, projectModuleMap, menuMap, subMenuMap, templateTabMap, menuMapWithSubMenuMap, menuListWithSubMenu, templateTabIdSet, templateMap, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet) {
        // Iterate over the Map using for...of and entries()
        for (const [key, value] of appResourceModuleTreeMap.entries()) {
            if(value && value.reference && value.reference._id){
                const projectModule = projectModuleMap.get(value.reference._id);
                if(projectModule && projectModule.name){
                    const moduleName = projectModule.name;
                    if(moduleName === 'MCH' && moduleName === 'MDM'){
                        mongoChart = true;
                    }
                    const appResourceModule = modules.has(moduleName) ? modules.get(moduleName) : new Map();
                    appResourceModule.set('details', projectModule);
                    if(value.reference.allSelected){
                        this.prepareResponseForModuleAllSelected(projectModule, appResourceModule, appRole?.appActionsList, tabNameWithPermissionActionsMap, menuListWithSubMenu, menuMap, templateMap, templateTabMap, templateTabIdSet, subMenuMap, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet);
                    }else{
                        this.prepareMenuMapForModuleMaster(appRole?.appActionsList, appResourceModule, value?.menus, tabNameWithPermissionActionsMap, menuMap, templateMap, templateTabMap, templateTabIdSet, menuMapWithSubMenuMap, subMenuMap, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet);
                    }
                    if (appResourceModule.has('menuMap') && appResourceModule.get('menuMap').size > 0 && moduleName) {
                        modules.set(moduleName, appResourceModule);
                    }
                }
            }
        }         
              
    }
    prepareResponseForModuleAllSelected(projectModules, appResourceModule, appActionsList, tabNameWithPermissionActionsMap, menuListWithSubMenu, menuMap, templateMap, templateTabMap, templateTabIdSet, subMenuMap, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet) {
        const menuListForModule = this.getMenuMasterByModuleName(projectModules.name, menuListWithSubMenu);
        if (menuListForModule && Array.isArray(menuListForModule) && menuListForModule.length > 0) {
            const permissionMenuMasterTreeMap = (appResourceModule.has('menuMap') && appResourceModule.get('menuMap').size > 0) ? appResourceModule.get('menuMap') : new Map();
            menuListForModule.forEach(menu => {
                const menuName = menu?.name;
                if (menu && menuName) {
                    const appResourceMenu = permissionMenuMasterTreeMap.has(menuName) ? permissionMenuMasterTreeMap.get(menuName) : new Map();
                    const clonedMenu = JSON.parse(JSON.stringify(menuMap.get(menu._id)));
                    if (!booleanFlag && clonedMenu || favouriteMenuAndSubMenuIds.has(clonedMenu._id)) clonedMenu['favourite'] = true;
                    appResourceMenu.set('details', clonedMenu);
                    if (!booleanFlag) favouriteMenuAndSubMenuIds.add(clonedMenu._id);
                    if (menu?.submenu && menu?.submenu?.length > 0) {
                        this.prepareResponseForSubMenuAllSelected(appActionsList, tabNameWithPermissionActionsMap, templateMap, templateTabMap, templateTabIdSet, subMenuMap, menu, appResourceMenu, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet);
                    } else {
                        this.prepareResponseForMenuAllSelected(menu, appResourceMenu, appActionsList, tabNameWithPermissionActionsMap, templateMap, templateTabMap, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet);
                    }
                    if (((appResourceMenu.has('templateTabMap') && appResourceMenu.get('templateTabMap').size > 0 ) || ((appResourceMenu.has('submenuMap') && appResourceMenu.get('submenuMap').size > 0))) && (menuSubMenuIds.has(menu._id) || booleanFlag) ) {
                        permissionMenuMasterTreeMap.set(menuName, appResourceMenu);
                        menuSubMenuIds.add(menu._id);
                    }
                }
            });

            if (permissionMenuMasterTreeMap?.size > 0) {
                appResourceModule.set('menuMap', permissionMenuMasterTreeMap);
            }
        }
    }
    getMenuMasterByModuleName(moduleName, menuListWithSubMenu) {         
        // Convert to a filtered array
        const filteredMenuList = menuListWithSubMenu
        .filter(menuMaster => menuMaster?.module_name)
        .filter(menuMaster => menuMaster.module_name === moduleName);
        return filteredMenuList;
    }
    prepareMenuMapForModuleMaster(appActionsList, appResourceModule, menus, tabNameWithPermissionActionsMap,
        menuMap, templateMap, templateTabMap, templateTabIdSet, menuMapWithSubMenuMap,
        subMenuMap, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet) {
        if (menus && menus.size > 0) {
            const appResourceMenuTreeMap = (appResourceModule.has('menuMap') && appResourceModule.get('menuMap').size > 0) ? appResourceModule.get('menuMap') : new Map();
            for (const [key, value] of menus.entries()) {
                if (value && value.reference && value.reference._id) {
                    const menu = menuMapWithSubMenuMap.get(value.reference._id);
                    const menuName = menu.name;
                    if (menu && menuName) {
                        const appResourceMenu = (appResourceMenuTreeMap.has(menuName)) ? appResourceMenuTreeMap.get(menuName) : new Map();
                        const clonedMenu = menuMap.get(menu._id);
                        if (!booleanFlag && clonedMenu || favouriteMenuAndSubMenuIds.has(clonedMenu._id)) clonedMenu['favourite'] = true;
                        appResourceMenu.set('details', clonedMenu);
                        if (!booleanFlag) favouriteMenuAndSubMenuIds.add(menu._id);
                        if (value.reference.allSelected) {
                            if (menu?.submenu && menu?.submenu?.length > 0) {
                                this.prepareResponseForSubMenuAllSelected(appActionsList, tabNameWithPermissionActionsMap, templateMap, templateTabMap, templateTabIdSet, subMenuMap, menu, appResourceMenu, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet);
                            } else {
                                this.prepareResponseForMenuAllSelected(menu, appResourceMenu, appActionsList, tabNameWithPermissionActionsMap, templateMap, templateTabMap, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet);
                            }
                        } else {
                            if (value && value.submenus && value.submenus?.size > 0) {
                                this.getAllSelectedSubMenuData(appActionsList, tabNameWithPermissionActionsMap, templateMap, templateTabMap, templateTabIdSet, subMenuMap, value, appResourceMenu, menu, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet);
                            } else {
                                this.prepareMenuMaster(appActionsList, appResourceMenu, value?.templateTabs, tabNameWithPermissionActionsMap, templateTabMap, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet);
                                if (appResourceMenu.has('templateTabMap') && appResourceMenu.get('templateTabMap').size > 0 && (menuSubMenuIds.has(menu._id) || booleanFlag)) {
                                    appResourceMenuTreeMap.set(menuName, appResourceMenu);
                                    menuSubMenuIds.add(menu._id);
                                }
                            }
                        }

                        if (((appResourceMenu.has('submenuMap') && appResourceMenu.get('submenuMap').size > 0) || (appResourceMenu.has('templateTabMap') && appResourceMenu.get('templateTabMap').size > 0)) && (menuSubMenuIds.has(menu._id) || booleanFlag)) {
                            appResourceMenuTreeMap.set(menuName, appResourceMenu);
                            menuSubMenuIds.add(menu._id);
                        }
                    }
                }
            }
            if (appResourceMenuTreeMap.size > 0) {
                appResourceModule.set('menuMap', appResourceMenuTreeMap);
            }
        }
    }
    prepareResponseForSubMenuAllSelected(appActionsList, tabNameWithPermissionActionsMap, templateMap, templateTabMap, templateTabIdSet, subMenuMap, menu, appResourceMenu, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet) {
        const appResourceSubMenuTreeMap = appResourceMenu.has('submenuMap') && appResourceMenu.get('submenuMap').size > 0 ? appResourceMenu.get('submenuMap') : new Map();
        menu.submenu.forEach(subMenu => {
            const subMenuForMenu = subMenuMap.get(subMenu._id);
            const subMenuForMenuName = subMenuForMenu?.name;
            if (subMenuForMenu && subMenuForMenuName) {
                const appResourceSubMenu = (appResourceSubMenuTreeMap.has(subMenuForMenuName)) ? appResourceSubMenuTreeMap.get(subMenuForMenuName) : new Map();
                const clonedMenu = JSON.parse(JSON.stringify(subMenuForMenu));
                if (!booleanFlag && clonedMenu || favouriteMenuAndSubMenuIds.has(clonedMenu._id)) clonedMenu['favourite'] = true;
                appResourceSubMenu.set('details', clonedMenu);
                if (!booleanFlag) favouriteMenuAndSubMenuIds.add(clonedMenu._id);
                this.prepareResponseForMenuAllSelected(subMenu, appResourceSubMenu, appActionsList, tabNameWithPermissionActionsMap, templateMap, templateTabMap, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet);
                if (appResourceSubMenu.has('templateTabMap') && appResourceSubMenu.get('templateTabMap').size > 0  && (menuSubMenuIds.has(subMenuForMenu._id) || booleanFlag)) {
                    appResourceSubMenuTreeMap.set(subMenuForMenuName, appResourceSubMenu);
                    menuSubMenuIds.add(subMenuForMenu._id);
                }
            }
        });

        if (appResourceSubMenuTreeMap.size > 0) {
            appResourceMenu.set('submenuMap', appResourceSubMenuTreeMap);
        }
    }
    prepareResponseForMenuAllSelected(menu, appResourceMenu, appActionsList, tabNameWithPermissionActionsMap, templateMap, templateTabMap, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet) {
        const menuName = menu?.name;
        const template = templateMap.get(menuName);
        if (template && template?.name && template.tabs && template?.tabs?.length > 0) {
            const tabIds = template?.tabs.map(tab => tab._id);
            if (tabIds && Array.isArray(tabIds) && tabIds.length > 0) {
                const appResourceTemplateTabTreeMap = (appResourceMenu.has('templateTabMap') && appResourceMenu.get('templateTabMap').size > 0) ? appResourceMenu.get('templateTabMap') : new Map();
                tabIds.forEach(tabId => {
                    const templateTab = templateTabMap.get(tabId);
                    const tabName = templateTab?.tab_name;
                    const tempTabId = templateTab?._id
                    if (templateTab && tabName && (templateTabIdSet.has(tempTabId) || booleanFlag)) {
                        const appResourceTemplateTab = appResourceTemplateTabTreeMap.has(tabName) ? appResourceTemplateTabTreeMap.get(tabName) : new Map();
                        appResourceTemplateTab.set('access', this.mergePermissionActions(appActionsList, tabName, tabNameWithPermissionActionsMap));
                        appResourceTemplateTab.set('label',templateTab?.label);
                        const gridId = templateTab?.grid_reference != null ? templateTab?.grid_reference?._id:null;
                        if(gridId != null){
                            const grid = templateHandler.gridMap.get(gridId);
                            if(grid && grid?.api_params_criteria && Array.isArray(grid.api_params_criteria) && grid.api_params_criteria.length > 0) {
                                const map = new Map();
                                map.set("api_params_criteria", grid?.api_params_criteria);
                                appResourceTemplateTab.set('grid', map);
                            }
                        }
                        const clonedTab = {};
                        clonedTab['_id'] = tempTabId;
                        appResourceTemplateTab.set('details', clonedTab);
                        appResourceTemplateTabTreeMap.set(tabName, appResourceTemplateTab);
                        templateTabIdSet.add(tempTabId);
                        if (!booleanFlag) fevouriteTemplateTabIdSet.add(tempTabId);
                    }
                });

                if(appResourceTemplateTabTreeMap.size > 0) {
                    appResourceMenu.set('templateTabMap', appResourceTemplateTabTreeMap);
                }
            }
        }
    }
    getAllSelectedSubMenuData(appActionsList, tabNameWithPermissionActionsMap, templateMap,templateTabMap, templateTabIdSet, subMenuMap, menuEntry,appResourceMenu, menu, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet) {
        const appResourceSubMenuTreeMap = appResourceMenu.has('submenuMap') && appResourceMenu.get('submenuMap').size > 0 ? appResourceMenu.get('submenuMap') : new Map();
        for (const [key, value] of  menuEntry.submenus.entries()) {
            if (value && value.reference && value.reference._id) {
                const subMenu = subMenuMap.get(value.reference._id);
                const subMenuName = subMenu?.name;
                if(value && value.templateTabs instanceof Object){
                    // console.log(value.templateTabs)
                }
                // const templateTabsMap = ;
                if (subMenu && subMenuName) {
                    const appResourceSubMenu = (appResourceSubMenuTreeMap.has(subMenuName)) ? appResourceSubMenuTreeMap.get(subMenuName) : new Map();
                    const clonedMenu = JSON.parse(JSON.stringify(subMenu));
                    if (!booleanFlag && clonedMenu || favouriteMenuAndSubMenuIds.has(clonedMenu._id)) clonedMenu['favourite'] = true;
                    appResourceSubMenu.set('details', clonedMenu);
                    if (!booleanFlag) favouriteMenuAndSubMenuIds.add(clonedMenu._id);
                    if (value?.reference?.allSelected) {
                        this.prepareResponseForMenuAllSelected(subMenu, appResourceSubMenu, appActionsList, tabNameWithPermissionActionsMap, templateMap, templateTabMap, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet);
                    } else {
                        this.prepareMenuMasterObject(appActionsList, appResourceSubMenu, value?.templateTabs, tabNameWithPermissionActionsMap, templateTabMap, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet);
                    }
                    if (appResourceSubMenu.has('templateTabMap') && appResourceSubMenu.get('templateTabMap').size > 0 && (menuSubMenuIds.has(subMenu._id) || booleanFlag)) {
                        appResourceSubMenuTreeMap.set(subMenuName, appResourceSubMenu);
                        menuSubMenuIds.add(subMenu._id);
                    }
                }
            }
        }
        if(appResourceSubMenuTreeMap?.size > 0) {
            appResourceMenu.set('submenuMap', appResourceSubMenuTreeMap);
        }
    }
    prepareMenuMaster(appActionsList, appResourceMenu,templateTabs, tabNameWithPermissionActionsMap, templateTabMap, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet) {        
        if (templateTabs && templateTabs.size > 0) {
            const tabRoleMap = appResourceMenu.has('templateTabMap') && appResourceMenu.get('templateTabMap').size > 0 ? appResourceMenu.get('templateTabMap') : new Map();
            for (const [key, value] of templateTabs.entries()) {
                if (value && value.reference && value.reference._id) {
                    const templateTab= templateTabMap.get(value.reference._id);
                    const tabName = templateTab?.tab_name;
                    if (templateTab && tabName && (templateTabIdSet.has(templateTab._id) || booleanFlag)) {
                        const appResourceTemplateTab = (tabRoleMap.has(tabName)) ? tabRoleMap.get(tabName) : new Map();
                        appResourceTemplateTab.set('access', this.mergePermissionActions(appActionsList, tabName, tabNameWithPermissionActionsMap));
                        appResourceTemplateTab.set('label',templateTab?.label);
                        const gridId = templateTab?.grid_reference != null ? templateTab?.grid_reference?._id:null;
                        if(gridId != null){
                            const grid = templateHandler.gridMap.get(gridId);
                            if(grid && grid?.api_params_criteria && Array.isArray(grid.api_params_criteria) && grid.api_params_criteria.length > 0) {
                                const map = new Map();
                                map.set("api_params_criteria", grid?.api_params_criteria);
                                appResourceTemplateTab.set('grid', map);
                            }
                        }
                        const clonedTab = {};
                        clonedTab['_id'] = templateTab._id;
                        appResourceTemplateTab.set('details', clonedTab);
                        tabRoleMap.set(tabName, appResourceTemplateTab);
                        templateTabIdSet.add(templateTab._id);
                        if (!booleanFlag) fevouriteTemplateTabIdSet.add(templateTab._id);
                    }
                }
            }
            if (tabRoleMap?.size > 0) {
                appResourceMenu.set('templateTabMap', tabRoleMap);
            }
        }
    }
    prepareMenuMasterObject(appActionsList, appResourceMenu,templateTabs, tabNameWithPermissionActionsMap, templateTabMap, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet) {        
        if (templateTabs && Object.keys(templateTabs).length > 0) {
            const tabRoleMap = appResourceMenu.has('templateTabMap') && appResourceMenu.get('templateTabMap').size > 0 ? appResourceMenu.get('templateTabMap') : new Map();
            for (const [key, value] of Object.entries(templateTabs)) {
                if (value && value.reference && value.reference._id) {
                    const templateTab= templateTabMap.get(value.reference._id);
                    const tabName = templateTab?.tab_name;
                    if (templateTab && tabName && (templateTabIdSet.has(templateTab._id) || booleanFlag)) {
                        const appResourceTemplateTab = (tabRoleMap.has(tabName)) ? tabRoleMap.get(tabName) : new Map();
                        appResourceTemplateTab.set('access', this.mergePermissionActions(appActionsList, tabName, tabNameWithPermissionActionsMap));
                        appResourceTemplateTab.set('label',templateTab?.label);
                        const gridId = templateTab?.grid_reference != null ? templateTab?.grid_reference?._id:null;
                        if(gridId != null){
                            const grid = templateHandler.gridMap.get(gridId);
                            if(grid && grid?.api_params_criteria && Array.isArray(grid.api_params_criteria) && grid.api_params_criteria.length > 0) {
                                const map = new Map();
                                map.set("api_params_criteria", grid?.api_params_criteria);
                                appResourceTemplateTab.set('grid', map);
                            }
                        }
                        const clonedTab = {};
                        clonedTab['_id'] = templateTab._id;
                        appResourceTemplateTab.set('details', clonedTab);
                        tabRoleMap.set(tabName, appResourceTemplateTab);
                        templateTabIdSet.add(templateTab._id);
                        if (!booleanFlag) fevouriteTemplateTabIdSet.add(templateTab._id);
                    }
                }
            }
            if (tabRoleMap?.size > 0) {
                appResourceMenu.set('templateTabMap', tabRoleMap);
            }
        }
    }
    mergePermissionActions(appActionsList, tab_name, tabNameWithPermissionActionsMap) {
        if (appActionsList == null || appActionsList.length == 0) {
            if (!tabNameWithPermissionActionsMap.has(tab_name)) {
                tabNameWithPermissionActionsMap.set(tab_name, Array.from(new Set([AppActions.VIEW])));
                return tabNameWithPermissionActionsMap.get(tab_name);
            } else {
                return tabNameWithPermissionActionsMap.get(tab_name);
            }
        }

        if (!tabNameWithPermissionActionsMap.has(tab_name)) {
            tabNameWithPermissionActionsMap.set(tab_name, this.permissionActionList(appActionsList));
            return tabNameWithPermissionActionsMap.get(tab_name);
        }

        const uniqueData = this.getUniquePermissionActioList(appActionsList, tabNameWithPermissionActionsMap.get(tab_name));
        tabNameWithPermissionActionsMap.set(tab_name, uniqueData);
        return uniqueData;
    }
    permissionActionList (actionsList){
        if (actionsList && !actionsList.includes(AppActions.VIEW)){
            actionsList.push(VIEW);
        }
        return actionsList ;
    }
    getUniquePermissionActioList(newActions,oldActions) {
        const permissionActions = new Set();
        const list = this.permissionActionList(newActions);
        if(list && list?.length > 0) list.forEach(name =>{permissionActions.add(name)});
        if(oldActions && oldActions?.length > 0) oldActions.forEach(name =>{permissionActions.add(name)});
        return [...permissionActions];        ;
    }
    async getMergedTemplateTabDataWithCentral(templateTabList, templateTabMap) {
        const templateTabs = await this.getListFromDatabase(TemplateTab, '_id name tab_name label grid_reference');
        if(templateTabs && templateTabs.length > 0){
            templateTabs.forEach(tab => {
                templateTabList.push(tab);
            })
        }
        // Add all entries from templateTabMap2 to templateTabMap1
        this.getObjectMap(templateTabList, keyExtractor).forEach((value, key) => {
            templateTabMap.set(key, value);
        });
        // templateTabList.addAll(templateHandler.getTabListForCentral());
        // templateTabMap.putAll(templateHandler.getTabMapForCentral());
        // console.log(templateTabList);
        // console.log(templateTabMap);
    }
    async getMergedProjectModuleDataWithCentral(projectModuleMap) {
        const projectModuleList = await this.fetchAllModuleListFromDbAndConvertToMap(templateHandler.getCoreModuleList());
        this.getObjectMap(projectModuleList, keyExtractor).forEach((value, key) => {
            projectModuleMap.set(key, value);
        });
        // projectModuleMap.putAll(templateHandler.getProjectModuleMapForCentral());
        
        // console.log(projectModuleMap);
        // console.log(templateTabMap);
    }
    async fetchAllModuleListFromDbAndConvertToMap(coreModuleList) {
        try {
            // Assuming idList is an array of ObjectId or strings representing ObjectIds
            const modules = await ProjectModules.find({
                name: { $nin: coreModuleList }
            }).select('_id name title index imgPath menu_list mouseHover description status appId refCode');    
            return modules;
        } catch (error) {
            console.error('Error finding app roles:', error);
            throw error;
        }
    }
    async getMergedMenuWithSubMenuWithCentral(menuListWithSubMenu,menuMapWithSubMenu,subMenuList,subMenuMap){
        const menuWithSubList = await this.fetchAllMenuWithSubMenuListAndConvertToMap();
        menuWithSubList.forEach(menu =>{menuListWithSubMenu.push(menu)});
        // menuListWithSubMenu.addAll(templateHandler.getMenuWithSubMenuListForCentral());
        this.getObjectMap(menuListWithSubMenu, keyExtractor).forEach((value, key) => {
            menuMapWithSubMenu.set(key, value);
        });
        menuListWithSubMenu.filter(menu => menu !== null && Array.isArray(menu.submenu) && menu.submenu.length > 0)
            .forEach(menu => {
                menu.submenu
                .filter(submenu => submenu !== null && submenu._id !== null && !subMenuMap.has(submenu._id))
                .forEach(submenu => subMenuMap.set(submenu._id, submenu));
            });
        const subMenuArray = Array.from(subMenuMap.values());
        if(subMenuArray && subMenuArray.length > 0){
            subMenuArray.forEach(submenu =>{subMenuList.push(submenu)});
        }
    }
    async fetchAllMenuWithSubMenuListAndConvertToMap() {
        try {
            // Assuming idList is an array of ObjectId or strings representing ObjectIds
            const coreModuleList = templateHandler.getCoreModuleList();
            const menus = await Menu.find({
                module_name: { $nin: coreModuleList }
            }).select('_id name label index submenu._id submenu.name submenu.label submenu.index module_name');    
            return menus;
        } catch (error) {
            console.error('Error finding Menu:', error);
            throw error;
        }
    }
    async fetchAllMenuListFromDbAndConvertToMap() {
        try {
            // Assuming idList is an array of ObjectId or strings representing ObjectIds
            const coreModuleList = templateHandler.getCoreModuleList();
            const menus = await Menu.find({
                module_name: { $nin: coreModuleList }
            }).select('_id name label index');    
            return menus;
        } catch (error) {
            console.error('Error finding Menu:', error);
            throw error;
        }
    }
    async getMergedMenuWithCentral(menuMap, menuList) {
        const MenuList = await this.fetchAllMenuListFromDbAndConvertToMap();
        MenuList.forEach(menu =>{menuList.push(menu)});
        // menuList.addAll(templateHandler.getMenuListForCentral());
        this.getObjectMap(MenuList, keyExtractor).forEach((value, key) => {
            menuMap.set(key, value);
        });
    }
    async getMergedTemplateWithCentral(templateList, templateMap) {
        const tempList = await this.fetchAllTemplateFromDbAndConvertToMap(templateHandler.getMenuWithSubMenuListForCentral())
        tempList.forEach(temp =>{templateList.push(temp);});     
        // templateList.addAll(templateHandler.getTemplateForCentral());
        this.getObjectMap(templateList, keyNameExtractor).forEach((value, key) => {
            templateMap.set(key, value);
        });
    }
    async fetchAllTemplateFromDbAndConvertToMap(menuWithSubMenuForCentral) {
        try {
            // Assuming idList is an array of ObjectId or strings representing ObjectIds
            const combinedList = this.getAllMenuAndSubMenuNamesFromTheList(menuWithSubMenuForCentral);
            const templates = await Template.find({
                name: { $nin: combinedList }
            }).select('_id name module label tabs');    
            return templates;
        } catch (error) {
            console.error('Error finding Menu:', error);
            throw error;
        }
    }
    getAllMenuAndSubMenuNamesFromTheList(menuWithSubMenuForCentral) {
        let combinedNames = [];
        if(menuWithSubMenuForCentral && menuWithSubMenuForCentral.length > 0){
            const isValidName = (name) => name && name.trim().length > 0;
            const menuNames = menuWithSubMenuForCentral
                .map(menu => menu.name)
                .filter(name => isValidName(name));

            const submenuNames = menuWithSubMenuForCentral
                .filter(menu => Array.isArray(menu.submenu) && menu.submenu.length > 0)
                .flatMap(menu => menu.submenu
                    .map(submenu => submenu.name)
                    .filter(name => isValidName(name))
                );
            // Combine and deduplicate the names
            combinedNames = Array.from(new Set([...topLevelNames, ...submenuNames]));
        }
        return combinedNames;
    }

    getMongoPermission(){
        return mongoChart;
    }
    async fetAppRoleAndAppRoleBindingAndAppUsersGroupAndProcessData(){
        const appRoleBindingList = await this.getListFromDatabase(AppRoleBinding, "_id name appRoleBindingSubjectList appRoleList");
        const appUsersGroupList = await this.getListFromDatabase(AppUsersGroup, "_id name appUser");
        const appUsersGroupMap = this.getObjectMap(appUsersGroupList, keyExtractor);
        const appGroupOfGroups = await this.getListFromDatabase(AppGroupOfGroup, "_id name appGroupList appUser");
        const appGroupOfGroupMap = this.getObjectMap(appGroupOfGroups, keyExtractor);
        const applicationUserList = await this.getListFromDatabase(ApplicationUser, "_id name email appId refCode");
        const applicationUserMap = this.getObjectMap(applicationUserList, keyExtractor);
        this.processAppRoleBindings(appRoleBindingList, appUsersGroupMap, applicationUserMap, appGroupOfGroupMap);
        const appRoleList = await this.getListFromDatabase(AppRole, "_id name appResourceList appMetaData appId refCode");
        this.processAppRoleCriteria(appRoleList);
        console.log('role id list store use wise !!!');
    }
    getListFromDatabase(model,list){
        return collectionHandler.findAllDocuments(model,list);
    }

    /**
     * Converts a list of objects into a Map where keys are extracted using the keyExtractor function.
     * @param {Array} objectList - The list of objects.
     * @param {Function} keyExtractor - The function to extract keys from the objects.
     * @returns {Map} A Map with keys extracted from objects and values being the objects.
     */
    getObjectMap(objectList, keyExtractor) {
        if (objectList && objectList.length > 0) {
        return objectList.reduce((map, obj) => {
            const key = keyExtractor(obj);
            map.set(key, obj);
            return map;
        }, new Map());
        }
        return new Map();
    }
    processAppRoleBindings(appRoleBindingList, appUsersGroupMap, applicationUserMap, appGroupOfGroupMap){
        if (appRoleBindingList && Array.isArray(appRoleBindingList) && appRoleBindingList.length > 0) {
            appRoleBindingList.forEach(appRoleBinding =>{
                if (appRoleBinding && appRoleBinding.appRoleBindingSubjectList && Array.isArray(appRoleBinding.appRoleBindingSubjectList) &&appRoleBinding.appRoleBindingSubjectList.length >0) {
                    appRoleBinding.appRoleBindingSubjectList.forEach(appRoleBindingSubject =>{
                        if(appRoleBindingSubject){
                            if(appRoleBindingSubject.appUserGroup){
                                const id = appRoleBindingSubject.appUserGroup._id;
                                const appUsersGroup = appUsersGroupMap.get(id);
                                this.getApplicationUserFromAppUsersGroupAndUpdateInMap(appRoleBinding,appUsersGroup,applicationUserMap);
                            }
                            if (appRoleBindingSubject.appApplicationUser) {
                                this.updateAppRolesForApplicationUser(appRoleBinding, applicationUserMap, appRoleBindingSubject.appApplicationUser);
                            }
                            if (appRoleBindingSubject.appUserGroupOfGroup) {
                                this.processAppGroupOfGroup(appUsersGroupMap, applicationUserMap, appGroupOfGroupMap, appRoleBinding, appRoleBindingSubject);
                            }
                        }
                    })
                }
            })
        }
    }
    processAppRoleCriteria(roleList){
        if(roleList && Array.isArray(roleList) && roleList.length > 0){
            for (const role of roleList) {
                let appResourceModuleTreeMap = null;
                if(role && role.appResourceList && role.appResourceList.size > 0) appResourceModuleTreeMap = role.appResourceList;
                if(appResourceModuleTreeMap){
                    appResourceModuleTreeMap.forEach((appResourceModule, key) => {
                        if(appResourceModule && appResourceModule.reference && appResourceModule.reference.name){
                            let moduleName = appResourceModule.reference.name;
                            if(appResourceModule.menus){
                                let appResourceMenuTreeMap = appResourceModule.menus;
                                if(appResourceMenuTreeMap){
                                    appResourceMenuTreeMap.forEach((appResourceMenu,key)=>{
                                        if(appResourceMenu && appResourceMenu.submenus){
                                            let appResourceSubMenuTreeMap = appResourceMenu.submenus;
                                            if(appResourceSubMenuTreeMap){
                                                appResourceSubMenuTreeMap.forEach((appResourceSubMenu,key) =>{
                                                    if(appResourceSubMenu && appResourceSubMenu.templateTabs){
                                                        let appResourceTemplateTabTreeMapTreeMap = appResourceSubMenu.templateTabs;
                                                        this.processRoleCriteriaFormTemplatetabs(moduleName,appResourceTemplateTabTreeMapTreeMap,role);
                                                    }
                                                })
                                            }
                                        }else{
                                           if(appResourceMenu && appResourceMenu.templateTabs){
                                                let appResourceTemplateTabTreeMapTreeMap = appResourceMenu.templateTabs;
                                                this.processRoleCriteriaFormTemplatetabs(moduleName,appResourceTemplateTabTreeMapTreeMap,role);
                                           } 
                                        }
                                    })
                                }
                            }
                        }
                    });                    
                }
            }
        }
    }
    processRoleCriteriaFormTemplatetabs(moduleName, appResourceTemplateTabTreeMapTreeMap, role){
        if(appResourceTemplateTabTreeMapTreeMap && appResourceTemplateTabTreeMapTreeMap.size > 0){
            appResourceTemplateTabTreeMapTreeMap.forEach((appResourceTemplateTab,key) => {
                if(appResourceTemplateTab && appResourceTemplateTab.criteria){
                    if(appResourceTemplateTab.reference && appResourceTemplateTab.reference._id){
                        const id = appResourceTemplateTab.reference._id;
                        const tab = templateHandler.tabMap.get(id);
                        let key = '';
                        key += role.appId + "_";
                        key += role.refCode + "_";
                        key += moduleName + "_";
                        key += tab.tab_name + "_";
                        key += role.name;
                        cacheService.rollIdWithCriteriaList.set(key,appResourceTemplateTab.criteria);
                    }
                }
            })
        }
    }
    processAppGroupOfGroup(appUsersGroupMap,applicationUserMap,appGroupOfGroupMap,appRoleBinding,appRoleBindingSubject){
        const id = appRoleBindingSubject?.appUserGroupOfGroup?._id;
        const appGroupOfGroup = null;
        if(id){
            appGroupOfGroup = appGroupOfGroupMap.get(id);
        }        
        if (appGroupOfGroup && appGroupOfGroup.appUser && Array.isArray(appGroupOfGroup.appUser) && appGroupOfGroup.appUser.length > 0) {
            appGroupOfGroup.appUser.forEach(appUser => {
                this.updateAppRolesForApplicationUser(appRoleBinding, applicationUserMap, appUser);
            });
        }
        if (appGroupOfGroup && appGroupOfGroup.appGroupList  && Array.isArray(appGroupOfGroup.appGroupList) && appGroupOfGroup.appGroupList.length > 0) {
            appGroupOfGroup.appGroupList.forEach(appUserGroup => {
                const id = appUserGroup?._id;
                const appUsersGroup = null;
                if(id){
                    appUsersGroup = appUsersGroupMap.get(id);
                }
                if(appUsersGroup){
                    this.getApplicationUserFromAppUsersGroupAndUpdateInMap(appRoleBinding, appUsersGroup, applicationUserMap);
                }
                
            });
        }
    }
    getApplicationUserFromAppUsersGroupAndUpdateInMap(appRoleBinding,appUsersGroup,applicationUserMap){
        if (appUsersGroup && appUsersGroup.appUser && Array.isArray(appUsersGroup.appUser) && appUsersGroup.appUser.length > 0) {
            appUsersGroup.appUser.forEach(appUser => {
                this.updateAppRolesForApplicationUser(appRoleBinding, applicationUserMap, appUser);
            });
        }
    }
    updateAppRolesForApplicationUser(appRoleBinding,applicationUserMap,appUser){
        let id = null;
        if(appUser && appUser._id){
            id = appUser._id
        }
        const applicationUser = applicationUserMap.get(id);
        if (applicationUser && appRoleBinding.appRoleList && Array.isArray(appRoleBinding.appRoleList) && appRoleBinding.appRoleList.length > 0) {
            this.addAppRoleIdsInMap(applicationUser, appRoleBinding.appRoleList);
        }
    }
    addAppRoleIdsInMap(applicationUser,appRoleReference){
        if (appRoleReference && appRoleReference.length > 0) {
            const appRoleIds = appRoleReference.map(reference => reference._id);
            const key = applicationUser.appId + "#" + applicationUser.refCode + "#" + applicationUser._id;
            if (cacheService.userIdWithAppRoleIds.has(key)) {
                const currentAppRoleIds = cacheService.userIdWithAppRoleIds.get(key);
                cacheService.userIdWithAppRoleIds.set(key, currentAppRoleIds.concat(appRoleIds));
            } else {
                cacheService.userIdWithAppRoleIds.set(key, appRoleIds);
            }
        }
    }
    async getAppRoles(userid) {
        const rollIds = cacheService.userIdWithAppRoleIds.get(userid);
        try {
            // Assuming idList is an array of ObjectId or strings representing ObjectIds
            const roles = await AppRole.find({
                _id: { $in: rollIds }
            });
    
            return roles;
        } catch (error) {
            console.error('Error finding app roles:', error);
            throw error;
        }
    }
    prepareRollList(rollList){
        let modifyRollList = [];
        if (rollList && Array.isArray(rollList) && rollList.length > 0){
            rollList.forEach(roll =>{
                const rollRef = commonUtil.getReference(roll);
                modifyRollList.push(rollRef);
            })
        }
        return modifyRollList;
    }
    getTemplateTabIdSet(current) {
        if (current && current._id && cacheService.userIdWithTemplateTabIdMap.has(current._id)){
            return cacheService.userIdWithTemplateTabIdMap.get(current._id);
        }
        return null;
    }

    getFevouriteTemplateTabIdSet(current) {
        if (current && current._id && cacheService.userIdWithFevouriteTemplateTabIdMap.has(current._id)){
            return cacheService.userIdWithFevouriteTemplateTabIdMap.get(current._id);
        }
        return null;
    }
    getAppResourceCriteria(key) {
        if (key){
            return cacheService.rollIdWithCriteriaList.get(key);
        }
        return null;
    }
    
}
module.exports = PermissionHandler;