const loadApi = require('../api/api');
const Config = require('../enum/config'); // Import the config file
const mongoose = require('mongoose');



const connectToDatabase = async () => {
  try {
    await mongoose.connect(Config.MONGODB_URI,{"dbName":Config.DATABASE_NAME});
    loadApi();
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};


module.exports = { connectToDatabase };