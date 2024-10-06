const express = require('express');
const router = express.Router();
const RestController = require('../controllers/restController');


const restController = new RestController();

router.post('/get_form/:_id', restController.getForm);


module.exports = router;