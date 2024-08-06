const { Map } = require("mongodb");
const CollectionHandler = require("./collectionHandler");
const AppRoleBinding = require("../model/permission/appRoleBinding");
const AppUsersGroup = require("../model/permission/appUsersGroup");
const AppGroupOfGroup = require("../model/permission/appGroupOfGroup");
const ApplicationUser = require("../model/permission/applicationUser");
const AppRole = require("../model/permission/appRole");
const CommonUtils = require("../utils/commonUtils");
const cacheService = require('../cache/cacheService');
const TemplateTab = require("../model/builder/templateTab");
const TemplateHandler = require("./templateHandler");
const ProjectModules = require("../model/builder/projectModules");
const Menu = require("../model/builder/menu");
const Template = require("../model/builder/template");
const UserPreference = require("../model/permission/userPreference");
const Operators = require("../enum/operator");
const QueryCriteria = require("./queryHandler/queryCriteria");

const collectionHandler = new CollectionHandler();
const commonUtil = new CommonUtils();
const templateHandler = new TemplateHandler()
const keyExtractor = obj => obj.id;
let mongoChart = false;

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
                const favouriteMenuAndSubMenuIds = new Set();
                const booleanFlag = false;
                const userPreference = await collectionHandler.findAllDocumentsWithListQueryCriteria(UserPreference, [QueryCriteria.createWithFieldOperatorAndValue('userId._id', Operators.EQUAL, user._id)], "index", 0, 0);
                const favouriteMenus = new Map();
                if (userPreference  && Array.isArray(userPreference) && userPreference.length > 0){
                    console.log("userprefrence");
                    // populateFavouriteModuleForUserPreference(favouriteMenus, userPreference.get(0));
                } 
                if (favouriteMenus.size > 0) {
                    // prepareMyFavorite(favouriteMenus, tabNameWithPermissionActionsMap, modules, menuMap, subMenuMap, templateTabMap, menuMapWithSubMenuMap, templateMap, menuSubMenuIds, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet);
                }
                if (appRoleList && Array.isArray(appRoleList) && appRoleList.length > 0) {
                    appRoleList.forEach(appRole => {
                        const appResourceModuleTreeMap = appRole.appResourceList;
                        if (appResourceModuleTreeMap && appResourceModuleTreeMap.size > 0) {
                            // console.log(appRole.name);
                            this.getModuleMasterObjectAndProcess(appRole, appResourceModuleTreeMap, modules, tabNameWithPermissionActionsMap, projectModuleMap, menuMap, subMenuMap,templateTabMap, menuMapWithSubMenuMap, menuListWithSubMenu, templateTabIdSet, templateMap, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet);
                        }
                    });
                }
                // console.log(modules); 
                if (modules.size > 0 && favouriteMenus.size > 0) {
                    booleanFlag = false;
                    // prepareMyFavorite(favouriteMenus, tabNameWithPermissionActionsMap, modules, menuMap, subMenuMap, templateTabMap, menuMapWithSubMenuMap, templateMap, menuSubMenuIds, templateTabIdSet, booleanFlag, fevouriteTemplateTabIdSet);
                }
                console.timeLog('getPermission','validateToken request received.');
            }
        } catch (error) {
            console.log(error);
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
                    const appResourceModule = (modules.has(moduleName)) ? modules.get(moduleName) : {};
                    appResourceModule['details'] = projectModule;
                    if(value.reference.allSelected){
                        // prepareResponseForModuleAllSelected(projectModules, appResourceModule, appRole?.appActionsList, tabNameWithPermissionActionsMap, menuListWithSubMenu, menuMap, templateMap, templateTabMap, templateTabIdSet, subMenuMap, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet);
                    }else{
                        // prepareMenuMapForModuleMaster(appRole?.appActionsList, appResourceModule, value?.menus, tabNameWithPermissionActionsMap, menuMap, templateMap, templateTabMap, templateTabIdSet, menuMapWithSubMenuMap, subMenuMap, menuSubMenuIds, booleanFlag, fevouriteTemplateTabIdSet);
                    }
                    // console.log(appResourceModule);
                    if (appResourceModule?.menuMap && appResourceModule?.menuMap.size > 0 && moduleName) {
                        modules.set(moduleName, appResourceModule);
                    }
                }
            }
        }         
              
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
        this.getObjectMap(templateList, keyExtractor).forEach((value, key) => {
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
        const appRoleList = this.getListFromDatabase(AppRole, "_id name appResourceList appMetaData appId refCode");
        // processAppRoleCriteria(appRoleList);
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
    
}
module.exports = PermissionHandler;