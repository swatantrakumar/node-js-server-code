const express = require('express');
const router = express.Router();
const { save } = require('../controllers/saveRestController');


router.post('/save/:coll', save);

module.exports = router;