const express = require('express');
const cors = require('cors');
const dataRoutes = require('../routes/dataRoutes');
const publicDataRoutes = require('../routes/publicDataRoutes');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const saveRoutes = require('./../routes/saveRoutes');
const downloadRoutes = require('./../routes/downloadRoutes');
const versionRoutes = require('./../routes/versionRoutes');
const restRoutes = require('./../routes/restServiceRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const authenticateJWT = require('../middleware/authenticateJWT');
const Config = require('../enum/config');
const LoadCache = require('../cache/loadCache');
const PermissionHandler = require('../handler/permissionHandler');
const templateHandler = require('../handler/templateHandler');
// const SendEmailHandler = require('../handler/sendEmailHandler');
const cron = require('node-cron');
require('dotenv').config();


const permissionHandler = new PermissionHandler();
// const sendEmailHandler = new SendEmailHandler();

const app = express();
// Use CORS middleware
app.use(cors());

async function loadApi (){
    // Middleware to parse JSON data
    app.use(express.json({ limit: '50mb' }));
    await LoadCache.refreshCache();
    await templateHandler.prepareTemplates();
    await permissionHandler.fetAppRoleAndAppRoleBindingAndAppUsersGroupAndProcessData();
    

    // Custom middleware to handle text/plain requests
    app.use('/rest', restRoutes); // Login route
    app.use('/rest/login',authMiddleware, authRoutes); // Login route
    app.use('/rest/rpts',authenticateJWT, dataRoutes);  // Use the data routes
    app.use('/rest/public/rpts', publicDataRoutes);  // Use the data routes
    app.use('/rest/user',authenticateJWT, userRoutes);  // Use the data routes
    app.use('/rest/ins',authenticateJWT, saveRoutes);  // Use the data routes  
    app.use('/rest/downloads',authenticateJWT,downloadRoutes);   
    app.use('/rest/git',authenticateJWT,versionRoutes);  
    
    app.listen(Config.PORT, () => {
        console.log(`Server is running on http://localhost:${Config.PORT}`);
    });

    // Schedule the task to run every 5 minutes
    // cron.schedule('*/5 * * * *', () => {
    //     console.log('Checking for pending emails...');
    //     // sendEmailHandler.sendPendingEmails();
    // });
    
}

module.exports = loadApi;