const loadApi = require('../api/api');
const Config = require('../enum/config'); // Import the config file
const mongoose = require('mongoose');



const connectToDatabase = async () => {
  try {
    const uri = `mongodb://${Config.DB_USER}:${Config.DB_PASSWORD}` +
      `@${Config.DB_HOST}:27017/${Config.DATABASE_NAME}?authSource=admin`;
    // await mongoose.connect(Config.MONGODB_URI,{"dbName":Config.DATABASE_NAME});
    await mongoose.connect(uri);
    loadApi();
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};


module.exports = { connectToDatabase };