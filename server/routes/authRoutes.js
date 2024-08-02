const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Login route
router.post('/signIn', AuthController.login);
// signin route
router.post('/signUp', AuthController.signUp);
// Forgot Password route
router.post('/fp', AuthController.signUp);
// Rest Password route
router.post('/rp', AuthController.signUp);
// Change Password route
router.post('/cp', AuthController.signUp);
// Verify route
router.post('/verify', AuthController.signUp);
// Two factor authentication route
router.post('/tfa', AuthController.signUp);


module.exports = router;