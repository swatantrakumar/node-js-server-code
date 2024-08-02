const mongoose = require('mongoose');
const AppResource = require('./appResource');
const AppResourceMenu = require('./appResourceMenu');

// Creating user schema
const AppResourceModule = mongoose.Schema({ 
    ...AppResource.schema.obj,
    menus:{
        type: Map,
        of: AppResourceMenu
    }
});


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppResourceModule;