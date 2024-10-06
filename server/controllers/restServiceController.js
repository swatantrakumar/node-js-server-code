const RetrievalQueryHandler = require('../handler/queryHandler/retrievalQueryHandler');
const UserPermissionHandler = require('../handler/userPermissionHandler');
const ProjectConstants = require('../enum/projectConstants');
const SearchCriteria = require('../handler/queryHandler/searchCriteria');
const AttachmentHandler = require('../handler/attachmentHandler');
const templateHandler = require('../handler/templateHandler');
const ApplicationHtmlHandler = require('../handler/htmlHandler/applicationHtmlHandler');

const retrievalQueryHandler = new RetrievalQueryHandler();
const userPermissionHandler = new UserPermissionHandler();
const attachmentHandler = new AttachmentHandler();
const applicationHtmlHandler = new ApplicationHtmlHandler();

class RestServiceController {
  genericSearch = async (req, res) =>{
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
  getClientIp(req) {
    let remoteAddr = req.headers['x-forwarded-for'];
    
    if (!remoteAddr) {
        remoteAddr = req.connection.remoteAddress || req.socket.remoteAddress;
    }
    
    return remoteAddr;
  }
  getDataForGrid = async (req,res) =>{
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
  getMultiGridData = async (req,res) =>{
      const kvpList = req.body;
      let result  = new Map();		
      const result_list = [];
      const employee = await userPermissionHandler.getApplicationUser(req);
      await Promise.all(kvpList.map(async kvp => {
          try {
            const reponse = new Map();
            const count = await retrievalQueryHandler.getCountWithQueryCriteria(employee,kvp);
            reponse.set("data_size", count);
            reponse.set( "value", kvp.value.toLowerCase() );
            reponse.set( "field", kvp.key3 );
            reponse.set( "adkeys", kvp.adkeys);
            result_list.push(Object.fromEntries(reponse));
          } catch (err) {
            console.error(err.stack);
          }
      }));
      result.set("success",result_list);
      res.json(Object.fromEntries(result));
  }
  getStaticData = async (req,res) =>{
    const kvpList = req.body;
    const result  = new Map();
    result.set("success",[]);
    const employee = await userPermissionHandler.getApplicationUser(req);
    if(kvpList && Array.isArray(kvpList) && kvpList.length > 0){
      for (const kvp of kvpList) {
        if(kvp.crList == null){
          kvp['crList'] = [];
        }
        kvp.crList?.push(new SearchCriteria("status","neq",ProjectConstants.STATUS_INACTIVE));
        const pageSize = kvp.pageSize == 0 ? 1000 : kvp.pageSize;
        kvp['pageSize'] = pageSize;
        const resultList= [];
        const sub_result = new Map();
        try {
          const values = kvp.value.split(":");
          const value = values[0].toLowerCase();
          await retrievalQueryHandler.getStaticDataResultForCoreMasters(result, employee, kvp, resultList, sub_result, values, value);
        }catch(e){
          console.log( "Error occured while fetching result..{}",e.message );
        }
        // processKvpforStaticDataCall(result, employee, kvp);
      }
    }
    res.json(Object.fromEntries(result));
    
  }
  getFileToView = async (req,res) =>{
    const kvpList = req.body;
    const result  = new Map();
    const employee = await userPermissionHandler.getApplicationUser(req);
    let link = await attachmentHandler.getAttachmentLink(kvpList);
    if(link){
      result.set("success", link);
    }else{
      result.set("error", "Unexpected Error Occured while saving");
    }
    res.json(Object.fromEntries(result));
  }
  getForm = async (req,res) => {
    const kvp = req.body;
    const result  = new Map();
    let id = req?.params?._id;
    let value = kvp?.value;
    try {
      let dataJson = JSON.parse(JSON.stringify(key.data));
      switch (value.toLowerCase()) {        
        default:
          let form = templateHandler.formMap.get(id);
          result.set("success",form);
          break;
      }
    } catch (e) {
      result.set( "error","Error occured while fetching form : " + e.message);
    }
    res.json(Object.fromEntries(result));
  }
  getHtml = async (req,res) => {
    const kvp = req.body;
    const result  = new Map();
    let id = req?.params?._id;
    try {
      await applicationHtmlHandler.getHtmlForObject(id,kvp,result);
    } catch (e) {
      result.set( "error","Error occured while fetching Html" + e.message);
    }
    res.json(Object.fromEntries(result));
  }
}


module.exports = RestServiceController;