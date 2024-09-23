const express = require('express');
const VersionRestController = require('../controllers/versionRestController');
const router = express.Router();


router.get('/version', VersionRestController.getVersion);

module.exports = router;