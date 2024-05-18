const { connectToDatabase } = require('./src/server/db/dbConnection');
const loadApi = require('./src/server/api/api');
const loadServer = require('./src/server/server.js');

// Connect to the MongoDB server
connectToDatabase().then(() => {
  loadApi(); 
  loadServer();  
});