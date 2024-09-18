const express = require('express');
const DownloadController = require('../controllers/downloadController');
const router = express.Router();

// Download route
router.post('/excelExport', DownloadController.excelExport);


module.exports = router;