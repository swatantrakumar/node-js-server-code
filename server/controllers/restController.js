
const templateHandler = require('../handler/templateHandler');



class RestController {
  getForm = async (req,res) => {
    const kvp = req.body;
    const result  = new Map();
    let id = req?.params?._id;
    let value = kvp?.value || kvp?.obj;
    try {
      let dataJson = JSON.parse(JSON.stringify(key?.data));
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
}


module.exports = RestController;