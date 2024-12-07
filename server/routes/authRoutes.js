const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Login route
router.post('/signIn', AuthController.login);
// signin route
router.post('/signUp', AuthController.signUp);
// Forgot Password route
router.post('/fp', AuthController.forgetPassword);
// Rest Password route
router.post('/rp', AuthController.resetPassword);
// Change Password route
router.post('/cp', AuthController.changePassword);
// Verify route
router.post('/verify', AuthController.verifyUser);
// Two factor authentication route
router.post('/tfa', AuthController.twoFactorAuthentication);


module.exports = router;