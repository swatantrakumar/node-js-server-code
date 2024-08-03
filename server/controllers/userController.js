const PermissionHandler = require("../handler/permissionHandler");
const UserPermissionHandler = require("../handler/userPermissionHandler");
const User = require("../model/auth/user");

const userPermissionHandler = new UserPermissionHandler();
const permissionHandler = new PermissionHandler();

class UserController {

    static validateUser = async (req, res) =>  {  
        const result = {};      
        const roleName = req.params.roleName;         
        const user = await userPermissionHandler.getApplicationUser(req); 
        const response =  await permissionHandler.getPermissionLists(user,result,roleName);
        user['chart'] = permissionHandler.getMongoPermission();
        result['user'] = user;
        result['permission'] = response;
        res.send(result);      
    }
}

module.exports = UserController;