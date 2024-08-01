const express = require('express');
const router = express.Router();
const { getPublicData } = require('../controllers/dataController');


router.post('/sobj', getPublicData);

module.exports = router;