const jwt = require('jsonwebtoken');
const secretKey  = require('../utils/jwtUtils');
// Importing User Schema
const User = require('../model/auth/user');
const CommonUtils = require('../utils/commonUtils');


const commonUtils = new CommonUtils();

class AuthController {

    static login = async (req, res) =>  {
        const body = commonUtils.decodeBase64(req.body);
        // Find user with requested email
        User.findOne({ email: body.email }, function (err, user) {
            if (user === null) {
                return res.status(400).send({
                    message: "User not found."
                });
            }
            else {
                if (user.validPassword(body.password)) {
                    const payload = {email : user.email};
                    // Generate JWT token
                    const token = jwt.sign(payload, secretKey.key, { expiresIn: '24h' });

                    // Return token to client
                    return res.status(200).send({token : token });
                }
                else {
                    return res.status(400).send({
                        message: "Wrong Password"
                    });
                }
            }
        });
    }

    static signUp = async (req, res) => {

        // Creating empty user object
        let newUser = new User();
    
        // Initialize newUser object with request data    
        newUser.createdBy = req.body.email;
        newUser.createdByName = req.body.name;
        if(req.body && Object.keys(req.body).length > 0){
            Object.keys(req.body).forEach(key => {
                newUser[key] = req.body[key];
            });
        }
    
        // Call setPassword function to hash password
        newUser.setPassword(req.body.password);        
    
        // Save newUser object to database
        newUser.save((err, User) => {
            if (err) {
                return res.status(400).send({
                    message: "Failed to add user."
                });
            }
            else {
                return res.status(201).send({
                    message: "User added successfully."
                });
            }
        });
    }
}

module.exports = AuthController;