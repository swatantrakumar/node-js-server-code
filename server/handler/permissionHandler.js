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
                // await this.getMergedMenuWithSubMenuWithCentral(menuListWithSubMenu, menuMapWithSubMenuMap, subMenuList, subMenuMap);

                // Fetching the MenuList list from DBas well from central env. and convert to map
                // await this.getMergedMenuWithCentral(menuMap, menuList);

                // Fetching the Template list from DB as well from central env. and convert to map
                // await this.getMergedTemplateWithCentral(templateList, templateMap);

                const appRoleList = await this.getAppRoles(userid);
                const roleList = this.prepareRollList(appRoleList);
                result["rollList"] = roleList;
                console.timeLog('getPermission','validateToken request received.');
            }
        } catch (error) {
            console.log(error);
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
        });;
        // projectModuleMap.putAll(templateHandler.getProjectModuleMapForCentral());
        
        console.log(projectModuleMap);
        // console.log(templateTabMap);
    }
    async fetchAllModuleListFromDbAndConvertToMap(coreModuleList) {
        try {
            // Assuming idList is an array of ObjectId or strings representing ObjectIds
            const modules = await ProjectModules.find({
                name: { $in: coreModuleList }
            }).select('_id name title index imgPath menu_list mouseHover description status appId refCode');
    
            return modules;
        } catch (error) {
            console.error('Error finding app roles:', error);
            throw error;
        }
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