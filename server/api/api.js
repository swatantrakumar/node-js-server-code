const express = require('express');
const dataRoutes = require('../routes/dataRoutes');
const authRoutes = require('../routes/authRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const authenticateJWT = require('../middleware/authenticateJWT');
const Config = require('../enum/config');
const LoadCache = require('../cache/loadCache');

const app = express();

function loadApi (){
    // Middleware to parse JSON data
    app.use(express.json());

    // Custom middleware to handle text/plain requests
    app.use('/auth',authMiddleware, authRoutes); // Login route
    app.use('/rest/rpts',authenticateJWT, dataRoutes);  // Use the data routes
    app.use('/rest/ins',authenticateJWT, dataRoutes);  // Use the data routes 
    
    app.listen(Config.PORT, () => {
        console.log(`Server is running on http://localhost:${Config.PORT}`);
    });
    LoadCache.refreshCache();
}

module.exports = loadApi;