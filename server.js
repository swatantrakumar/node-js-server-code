const express = require('express');
const Config = require('./enum/config');
const app = express();

const { connectToDatabase } = require('./db/dbConnection');
const dataRoutes = require('./routes/dataRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware to parse JSON data
app.use(express.json());

// Connect to the MongoDB server
connectToDatabase().then(() => {
  // Use the data routes
  app.use('/rest/rpts', dataRoutes);  
  app.use('/auth', authRoutes); // Login route

  // Start the server
  app.listen(Config.PORT, () => {
    console.log(`Server is running on http://localhost:${Config.PORT}`);
  });
});