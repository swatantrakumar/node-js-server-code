const jwt = require('jsonwebtoken');
const { secretKey } = require('../utils/jwtUtils');
// Importing User Schema
const User = require('../model/user');

const login = async (req, res) =>  {
    // Find user with requested email
    User.findOne({ email: req.body.email }, function (err, user) {
        if (user === null) {
            return res.status(400).send({
                message: "User not found."
            });
        }
        else {
            if (user.validPassword(req.body.password)) {
                return res.status(201).send({
                    message: "User Logged In",
                })
            }
            else {
                return res.status(400).send({
                    message: "Wrong Password"
                });
            }
        }
    });
    try {

    }catch(error){

    }
    // Example: Authenticate user based on credentials
    const { username, password } = req.body;

    // Example: Check user credentials against database
    if (username === 'admin' && password === 'password') {
        // Generate JWT token
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

        // Return token to client
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
}

const signUp = async (req, res) => {

    // Creating empty user object
    let newUser = new User();
 
    // Initialize newUser object with request data
    newUser.name = req.body.name, 
    newUser.email = req.body.email
 
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

module.exports = {
    login,
    signUp
};