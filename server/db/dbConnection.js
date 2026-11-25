const loadApi = require('../api/api');
const Config = require('../enum/config'); // Import the config file
const mongoose = require('mongoose');

let isApiLoaded = false;

// Connection Event Handlers to prevent crashes on network drops
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err?.message || err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Reconnecting...');
});

const connectToDatabase = async () => {
  try {    
    await mongoose.connect(Config.MONGODB_URI, {
      dbName: Config.DATABASE_NAME,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50,
      minPoolSize: 2,
    });
    if (!isApiLoaded) {
      loadApi();
      isApiLoaded = true;
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

module.exports = { connectToDatabase };