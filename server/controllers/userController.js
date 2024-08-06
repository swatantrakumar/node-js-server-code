const PermissionHandler = require("../handler/permissionHandler");
const UserPermissionHandler = require("../handler/userPermissionHandler");
const User = require("../model/auth/user");

const userPermissionHandler = new UserPermissionHandler();
const permissionHandler = new PermissionHandler();

class UserController {

    static validateUser = async (req, res) =>  { 
        console.time('getPermission');        
        const result = {};      
        const roleName = req.params.roleName;         
        const user = await userPermissionHandler.getApplicationUser(req); 
        try {
            await permissionHandler.getPermissionLists(user,result,roleName);
            user['chart'] = permissionHandler.getMongoPermission();
            result['user'] = user;
            console.timeEnd('getPermission');
            res.send(result); 
        } catch (error) {
            console.log(error);
        }      
    }
}

module.exports = UserController;