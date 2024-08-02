const { Map } = require("mongodb");
const CollectionHandler = require("./collectionHandler");
const AppRoleBinding = require("../model/permission/appRoleBinding");
const AppUsersGroup = require("../model/permission/appUsersGroup");
const AppGroupOfGroup = require("../model/permission/appGroupOfGroup");
const ApplicationUser = require("../model/permission/applicationUser");

const collectionHandler = new CollectionHandler();

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
        // const appUsersGroupMap = getObjectMap(appUsersGroupList, AppUsersGroup::get_id);
        const appGroupOfGroups = this.getListFromDatabase(AppGroupOfGroup, "_id name appGroupList appUser");
        // Map<String, AppGroupOfGroup> appGroupOfGroupMap = getObjectMap(appGroupOfGroups, AppGroupOfGroup::get_id);
        const applicationUserList = this.getListFromDatabase(ApplicationUser, "_id name email appId refCode");
        // const applicationUserMap = getObjectMap(applicationUserList, ApplicationUser::get_id);
        processAppRoleBindings(appRoleBindingList, appUsersGroupMap, applicationUserMap, appGroupOfGroupMap);
        const appRoleList = this.getListFromDatabase(AppRole, "_id name appResourceList appMetaData appId refCode");
        processAppRoleCriteria(appRoleList);
    }
    getListFromDatabase(model,list){
        return collectionHandler.findAllDocuments(model,list);
    }
}
module.exports = PermissionHandler;