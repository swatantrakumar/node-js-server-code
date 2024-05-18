const { connectToDatabase } = require('./server/db/dbConnection');
const loadApi = require('./server/api/api');
const loadServer = require('./server/server.js');

// Connect to the MongoDB server
connectToDatabase().then(() => {
  loadApi(); 
  // loadServer();  
});