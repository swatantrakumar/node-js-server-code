const mongoose = require('mongoose');
const AppResource = require('./appResource');
const AppResourceTemplateTab = require('./appResourceTemplateTab');

// Creating user schema
const AppResourceMenu = mongoose.Schema({ 
    ...AppResource.schema.obj,
    submenus:{
        type: Map,
        of: this
    },
    templateTabs:{
        type: Map,
        of: AppResourceTemplateTab
    }
});


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppResourceMenu;