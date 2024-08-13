const UserPermissionHandler = require("../handler/userPermissionHandler");
const cacheService = require('../cache/cacheService');
const InComingDataHandler = require("../handler/InComingDataHandler");
const FileHandler = require("../handler/fileHandler");
const commonConstant = require('../enum/commonConstant');

const userPermissionHandler = new UserPermissionHandler()
const coreInComingDataHandler = new InComingDataHandler();
const excelUploadFileHandler = new FileHandler();

const save = async (req,res) =>{
    const object = req.body;
    let colName = req?.params?.coll;
    let result = new Map();
	let user = null;
    try {
        user = await userPermissionHandler.getApplicationUser(req);
        if (colName && colName == "user_preference") {
            // return  userPreferenceHandler.mergeUserPreferenceForUser(object, user, colName);
        }
        const jsonInString = JSON.stringify(object);
        const jsonObject = JSON.parse(jsonInString);
        const pojoMaster = cacheService.getPojoFromCollection(colName.toLowerCase());
        let messageAttributes = {};
        messageAttributes.collection = {
            dataType: "String",
            stringValue: colName
        };

        messageAttributes.user = {
            dataType: "String",
            stringValue: JSON.stringify(user)
        };
        if(colName && colName == "user_preference"){
            jsonObject["refCode"] = user.refCode;
        }
        // if(colName == "alert_notification") {
        //     const alerts = new Alerts(jsonObject); 
        //     alerts.createdDate = new Date();
        //     alerts.createdBy = user.email;
        //     attachmentHandler.handleAlertAttachement(alerts);
        //     collectionHandler.insertDocument(alerts,notifierDb);
        // }
        const sqsFlowForEntireApplication = cacheService.getConfiguration(jsonObject.refCode, "SQS_FLOW_FOR_ENTIRE_APPLICATION");
        if(sqsFlowForEntireApplication){
            // awsSQSHandler.handleDataWithQueue(colName, jsonInString, jsonObject, user, result, messageAttributes,"save");
        }else{
            if(pojoMaster && pojoMaster.sqsFlow){
                // awsSQSHandler.handleDataWithQueue(colName, jsonInString, jsonObject, user, result, messageAttributes,"save");
            }else{
                result = await saveFromSqsForSaveCall(colName,object,user);
                console.log("save call");
            }
        }
    } catch (e) {
        result.set("error","Error occured while saving, Please re-try after refresh !!!");
		result.set("details",e.message);
        console.error(e.stack)        
    }
    
    res.json(Object.fromEntries(result));
  }

  async function saveFromSqsForSaveCall(coll, object, user){
        const currentTime = Date.now();
		let result= new Map();
        try {
            const jsonInString = JSON.stringify(object);
            let jsonObject = JSON.parse(jsonInString);
            if (coreInComingDataHandler.updateCreatorUpdaterInfoInJson(result, jsonObject,user)) return result;
            jsonObject = excelUploadFileHandler.handleUploadThroughExcel(coll, object, user, jsonObject);
            if(coll == "clone_tab"){
                // cloneTabHandler.cloneTab(gson.fromJson(jsonInString, CloneTab.class));
            }else {
                switch (cacheService.getPojoScope(coll)) {
                    case commonConstant.POJO_SCOPE_CORE:
                        coreInComingDataHandler.saveOrUpdateMasterObject(result, coll, jsonObject);
                        // if(coll == "move_modules" || coll == "compare_modules") {
                        //     const mapper = new ObjectMapper();
                        //     const moveModules = mapper.readValue(jsonObject.toString(), MoveModules.class);
                        //     Map<String, Object> previousObject = moveModules.getPrevious_object();
                        //     Map<String, Object> currentObject = moveModules.getCurrent_object();
                        //     const rootPath = "D:\\elabs\\compare\\" + currentTime;
                        //     try {
                        //         new File(rootPath).mkdir();
                        //         new File(rootPath+"\\host2").mkdir();
                        //         mastersHandler.exportToFolder(rootPath+"\\host2", previousObject);
                        //         new File(rootPath+"\\host1").mkdir();
                        //         mastersHandler.exportToFolder(rootPath+"\\host1", currentObject);
                        //     } catch (e) {
                        //         console.error(e.stack);
                        //     }
                        // }
                        break;
                    case commonConstant.POJO_SCOPE_SCRIPT:
                        // scriptRunner.runOnSaveMethods(result, coll, jsonObject);
                        break;
                    default:
                        applicationDataEnricherHandler.saveOrUpdateMasterObject(result, coll, jsonObject, user);
                        break;
                }
            }
        } catch (e) {
            result.set("error","Error occured while saving, Please re-try after refresh !!!");
			result.set("details",e.message);
            console.log(e.message);    
        }
        console.log("Total Time Consumed Class Name Method : save" + " Collection "+ coll + "   "+ (Date.now() - currentTime));
        return result;
  }

  module.exports = {  save };