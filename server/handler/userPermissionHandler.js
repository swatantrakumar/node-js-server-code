const CollectionHandler = require("./collectionHandler");
const ApplicationUser = require("../model/permission/applicationUser");
const collectionHandler = new CollectionHandler();


class UserPermissionHandler {
    async getApplicationUser(req){  
        const userId = req.user?.email;
        const user = await collectionHandler.findDocumentById(ApplicationUser,userId,'email','name email appId refCode _id');
        return user;
    }
}
module.exports = UserPermissionHandler;