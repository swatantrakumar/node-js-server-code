const { Map } = require("mongodb");
const CollectionHandler = require("./collectionHandler");
const AppRoleBinding = require("../model/permission/appRoleBinding");
const AppUsersGroup = require("../model/permission/appUsersGroup");
const AppGroupOfGroup = require("../model/permission/appGroupOfGroup");
const ApplicationUser = require("../model/permission/applicationUser");
const AppRole = require("../model/permission/appRole");
const CommonUtils = require("../utils/commonUtils");
const cacheService = require('../cache/cacheService');

const collectionHandler = new CollectionHandler();
const commonUtil = new CommonUtils();
const keyExtractor = obj => obj.id;
const mongoChart = false;

class PermissionHandler{
    
    async getPermissionLists(user,result,roleName){
        const userid = user.appId + "#" + user.refCode + "#" + user._id;
        try {
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

                const appRoleList = await this.getAppRoles(userid);
                const roleList = this.prepareRollList(appRoleList);
                result["rollList"] = roleList;
            }
        } catch (error) {
            console.log(error);
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