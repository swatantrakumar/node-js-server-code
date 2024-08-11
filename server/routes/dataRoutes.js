const express = require('express');
const router = express.Router();
const {genericSearch ,getDataForGrid, getMultiGridData } = require('../controllers/dataController');

// router.get('/data', getData);
// router.post('/data', postData);

router.post('/gd/:orderBy', getDataForGrid);
router.post('/sobj', genericSearch);
router.post('/sobj/:orderBy', genericSearch);
router.post('/gd_list', getMultiGridData);

module.exports = router;