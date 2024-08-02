const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Login route
router.post('/utvn/v2/:roleName', UserController.validateUser);


module.exports = router;