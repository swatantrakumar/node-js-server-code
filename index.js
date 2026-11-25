require('dotenv').config();
const { connectToDatabase } = require('./server/db/dbConnection');

// Global handlers to prevent ECONNRESET and network drops from crashing nodemon
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  if (err && err.code === 'ECONNRESET') {
    console.warn('Intercepted ECONNRESET: Socket closed unexpectedly by MongoDB peer.');
    return;
  }
  console.error('Uncaught Exception:', err);
});

// Connect to the MongoDB server
connectToDatabase();
