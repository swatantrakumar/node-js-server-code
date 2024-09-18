const PrintReportHandler = require("../handler/printReportHandler");
const CommonUtils = require("../utils/commonUtils");


const printReportHandler = new PrintReportHandler();
const commonUtil = new CommonUtils();

class DownloadController {
    static excelExport = async (req, res) => {
        try {
            let kvp = req.body;
            let byteArray = null;
            try {
                byteArray = await printReportHandler.createReport(commonUtil.getValueFromJSONObject(kvp,"kvp.key3"),kvp);
            } catch (error) {
               console.log('Excle File not created....') 
               console.error(error.stack);
            }
            // Send the byte array in the response
            res.send(byteArray);
        } catch (e) {
            console.error(e.stack);
            return null;
        }
    }
}
module.exports = DownloadController;

