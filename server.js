const express = require('express');
const Config = require('./enum/config');
const app = express();

const { connectToDatabase } = require('./db/dbConnection');
const dataRoutes = require('./routes/dataRoutes');

// Middleware to parse JSON data
app.use(express.json());

// Connect to the MongoDB server
connectToDatabase().then(() => {
  // Use the data routes
  app.use('/api', dataRoutes);

  // Start the server
  app.listen(Config.PORT, () => {
    console.log(`Server is running on http://localhost:${Config.PORT}`);
  });
});