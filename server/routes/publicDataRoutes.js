const express = require('express');
const router = express.Router();
const { genericSearch } = require('../controllers/dataController');


router.post('/sobj', genericSearch);

module.exports = router;