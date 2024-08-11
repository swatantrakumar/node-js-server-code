const RetrievalQueryHandler = require('../handler/queryHandler/retrievalQueryHandler');
const UserPermissionHandler = require('../handler/userPermissionHandler');

const retrievalQueryHandler = new RetrievalQueryHandler();
const userPermissionHandler = new UserPermissionHandler()

const genericSearch = async (req, res) =>{
    let result = [];
    let kvp = req.body;
    let orderBy = req?.params?.orderBy; 
    let employee = null; 
		try {
			console.log("sobj call receved for {} from Ip {}, Crlist : {}", kvp.value, getClientIp(req),kvp.crList);
			if(req && req.user) employee = await userPermissionHandler.getApplicationUser(req);
			if(!orderBy) {
				orderBy = retrievalQueryHandler.getDefaultSortByString(kvp.value);
			}
			result = await retrievalQueryHandler.processApplicationSobjCall(employee,orderBy, kvp);
		}catch (e) {
			console.log("Error while Generic call 'sobj' : " + e.message);
			res.status(500).json({ error: 'Failed to Get Template ' + req.body.value  + er});
		}
		res.json(result);
}
function getClientIp(req) {
  let remoteAddr = req.headers['x-forwarded-for'];
  
  if (!remoteAddr) {
      remoteAddr = req.connection.remoteAddress || req.socket.remoteAddress;
  }
  
  return remoteAddr;
}
const getDataForGrid = async (req,res) =>{
  const kvp = req.body;
  const response_result = new Map();
  let orderBy = req?.params?.orderBy;
  try {
			const employees = await userPermissionHandler.getApplicationUser(req);
			const columns = kvp.value.split( ";" );
			const colName = columns[0];
			if (orderBy == 'null') {
				orderBy = retrievalQueryHandler.getDefaultSortByString(colName);
			}			
			await retrievalQueryHandler.processCoreMasterGridDataCall(employees,response_result,kvp,orderBy,colName);			
		}
		catch (e) {
			console.log("Error while Generic call 'sobj' : " + e.message);
			response_result.set("error","Unexpected Error occured while call");
		}
    res.json(Object.fromEntries(response_result));
}
const getMultiGridData = async (req,res) =>{
    let result  = new Map();
		result.set("success",[]);
    res.json(result);
}



module.exports = {  genericSearch , getDataForGrid, getMultiGridData };