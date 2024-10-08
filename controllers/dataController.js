const { getDb } = require('../db/dbConnection');

const getData = async (req, res) => {
  try {
    const db = getDb();
    const collectionName = "app_form_template";
    const data = await db.collection(collectionName)
                    .find({})
                    .limit(25)
                    .toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

const postData = async (req, res) => {
  try {   
    const db = getDb(); 
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
    var query = getQuery();  
    if(collectionName != ""){   
        let collection =  db.collection(collectionName);      
        data = await collection.countDocuments(query)
                .then(count =>{
                    dataSize = count;                        
                    return getDataFromDb(collection,query,pageNumber,pageSize);                        
                })    
    }
    res.json(createResponse(data,dataSize));
  } catch (error) {
    res.status(500).json({ error: 'Failed to Get data ' + req.body.value });
  }
};

function getQuery(queyrList){
    let query = {};

    return query;
}

function getDataFromDb(collection,query,pageNumber,pageSize){
    var skipAmount = (pageNumber - 1) * pageSize;
    return collection.find(query)
                    .skip(skipAmount)
                    .limit(pageSize)
                    .toArray();
}
function createResponse(data, dataSize) {
    return {
        data: data,
        dataSize: dataSize
    };
}


module.exports = { getData, postData };