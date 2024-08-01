const express = require('express');
const router = express.Router();
const { getData, getGridData, getPublicData } = require('../controllers/dataController');

// router.get('/data', getData);
// router.post('/data', postData);

router.post('/gd', getGridData);
router.post('/sobj', getPublicData);

module.exports = router;