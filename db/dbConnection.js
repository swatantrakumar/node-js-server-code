const { MongoClient } = require('mongodb');
const Config = require('../enum/config'); // Import the config file


const client = new MongoClient(Config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db(Config.DATABASE_NAME);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

const getDb = () => db;

module.exports = { connectToDatabase, getDb };