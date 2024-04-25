const express = require('express');
const router = express.Router();
const { login, signUp } = require('../controllers/authController');

// Login route
router.post('/login', login);
// signin route
router.post('/signup', signUp)

module.exports = router;