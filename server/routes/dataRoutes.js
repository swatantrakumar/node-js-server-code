const express = require('express');
const RestServiceController = require('../controllers/restServiceController');
const router = express.Router();



const restServiceController = new RestServiceController();


router.post('/gd/:orderBy', restServiceController.getDataForGrid);
router.post('/sobj', restServiceController.genericSearch);
router.post('/sobj/:orderBy', restServiceController.genericSearch);
router.post('/gd_list', restServiceController.getMultiGridData);
router.post('/gsd', restServiceController.getStaticData);
router.post('/getfl/:viewOrDownload', restServiceController.getFileToView);
router.post('/get_form/:_id', restServiceController.getForm);
router.post('/get_html/:_id', restServiceController.getHtml);
router.post('/get_pdf/:_id', restServiceController.getPdf);



module.exports = router;