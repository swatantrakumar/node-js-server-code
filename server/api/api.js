const express = require('express');
const cors = require('cors');
const dataRoutes = require('../routes/dataRoutes');
const publicDataRoutes = require('../routes/publicDataRoutes');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const authenticateJWT = require('../middleware/authenticateJWT');
const Config = require('../enum/config');
const LoadCache = require('../cache/loadCache');
const PermissionHandler = require('../handler/permissionHandler');
const TemplateHandler = require('../handler/templateHandler');


const permissionHandler = new PermissionHandler();
const templateHandler = new TemplateHandler();

const app = express();
// Use CORS middleware
app.use(cors());

async function loadApi (){
    // Middleware to parse JSON data
    app.use(express.json());
    await LoadCache.refreshCache();
    await permissionHandler.fetAppRoleAndAppRoleBindingAndAppUsersGroupAndProcessData();
    await templateHandler.prepareTemplates();

    // Custom middleware to handle text/plain requests
    app.use('/rest/login',authMiddleware, authRoutes); // Login route
    app.use('/rest/rpts',authenticateJWT, dataRoutes);  // Use the data routes
    app.use('/rest/public/rpts', publicDataRoutes);  // Use the data routes
    app.use('/rest/user',authenticateJWT, userRoutes);  // Use the data routes
    app.use('/rest/ins',authenticateJWT, dataRoutes);  // Use the data routes     
    
    app.listen(Config.PORT, () => {
        console.log(`Server is running on http://localhost:${Config.PORT}`);
    });
    
}

module.exports = loadApi;