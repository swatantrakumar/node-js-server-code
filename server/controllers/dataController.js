const RetrievalQueryHandler = require('../handler/queryHandler/retrievalQueryHandler');
const UserPermissionHandler = require('../handler/userPermissionHandler');
const CommonUtils  = require('../utils/commonUtils');



const commonUtils = new CommonUtils();
const retrievalQueryHandler = new RetrievalQueryHandler();
const userPermissionHandler = new UserPermissionHandler()


const getGridData = async (req, res) => {
  try {  
    let model = "";
    const newData = req.body;
    var collectionName = "";
    var pageSize = 25;
    var pageNumber = 1;
    var dataSize = 0;
    var data = [];
    
    if(newData){
        if(newData.value){
            collectionName = newData.value;
        }
        if(newData.pageSize){
            pageSize = newData.pageSize;
        }
        if(newData.pageNo){
            pageNumber = newData.pageNo;
        }
    }  
    if(collectionName != ""){      
      model = await commonUtils.getModel(collectionName);      
      var query = getQuery();  
      if(model){  
          data = await model.countDocuments(query)
                  .then(count =>{
                      dataSize = count;                        
                      return getDataFromDb(model,query,pageNumber,pageSize);                        
                  })    
      }else{
        console.log("Model Not exits for this collection Name => "+ collectionName);
      }
    }
    res.json(createResponse(data,dataSize));
  } catch (er) {
    res.status(500).json({ error: 'Failed to Get data ' + req.body.value  + er});
  }
};
const genericSearch = async (req, res) =>{
    let result = [];
    let kvp = req.body;
    let orderBy = req?.params?.orderBy;  
		try {
			console.log("sobj call receved for {} from Ip {}, Crlist : {}", kvp.value, getClientIp(req),kvp.crList);
			const employee = await userPermissionHandler.getApplicationUser(req);
			if(!orderBy) {
				orderBy = retrievalQueryHandler.getDefaultSortByString(kvp.value);
			}
			result = await retrievalQueryHandler.processApplicationSobjCall(employee,orderBy, kvp);
		}catch (e) {
			console.log("Error while Generic call 'sobj' : " + e.message);
			// e.printStackTrace();
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
function getQuery(queyrList){
    let query = {};

    return query;
}

function getDataFromDb(collection,query,pageNumber,pageSize){
    var skipAmount = (pageNumber - 1) * pageSize;
    return collection.find(query)
                    .skip(skipAmount)
                    .limit(pageSize)
                    .exec();
}
function createResponse(data, dataSize) {
    return {
        data: data,
        dataSize: dataSize
    };
}


module.exports = {  getGridData, genericSearch };