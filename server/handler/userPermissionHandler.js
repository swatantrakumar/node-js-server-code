const CollectionHandler = require("./collectionHandler");
const User = require("../model/auth/user");
const collectionHandler = new CollectionHandler();


class UserPermissionHandler {
    async getApplicationUser(req){  
        const userId = req.user.email;
        const user = await collectionHandler.findDocumentById(User,userId,'email','name email appId refCode _id');
        return user;
    }
}
module.exports = UserPermissionHandler;