const express = require('express');
const router = express.Router();
const RestServiceController = require('../controllers/restServiceController');

const restServiceController = new RestServiceController();

router.post('/sobj', restServiceController.genericSearch);

module.exports = router;