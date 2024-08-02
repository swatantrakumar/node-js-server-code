const { Map } = require("mongodb");
const CollectionHandler = require("./collectionHandler");
const AppRoleBinding = require("../model/permission/appRoleBinding");
const AppUsersGroup = require("../model/permission/appUsersGroup");
const AppGroupOfGroup = require("../model/permission/appGroupOfGroup");
const ApplicationUser = require("../model/permission/applicationUser");
const AppRole = require("../model/permission/appRole");

const collectionHandler = new CollectionHandler();
const keyExtractor = obj => obj.id;

class PermissionHandler{
    constructor(){
        this.userIdWithAppRoleIds = new Map();
    }
    getPermissionLists(user,result,roleName){
        const userid = user.appId + "#" + user.refCode + "#" + user._id;
        return userid;
    }
    async fetAppRoleAndAppRoleBindingAndAppUsersGroupAndProcessData(){
        const appRoleBindingList = await this.getListFromDatabase(AppRoleBinding, "_id name appRoleBindingSubjectList appRoleList");
        const appUsersGroupList = await this.getListFromDatabase(AppUsersGroup, "_id name appUser");
        const appUsersGroupMap = this.getObjectMap(appUsersGroupList, keyExtractor);
        const appGroupOfGroups = this.getListFromDatabase(AppGroupOfGroup, "_id name appGroupList appUser");
        const appGroupOfGroupMap = this.getObjectMap(appGroupOfGroups, keyExtractor);
        const applicationUserList = this.getListFromDatabase(ApplicationUser, "_id name email appId refCode");
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
                if (appRoleBinding && appRoleBinding) {}
            })
        }
    }
    
}
module.exports = PermissionHandler;