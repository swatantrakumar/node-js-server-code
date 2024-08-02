const mongoose = require('mongoose');
const AppResource = require('./appResource');
const AppResourceGrid = require('./appResourceGrid');
const AppResourceForm = require('./appResourceForm');

// Creating user schema
const AppResourceTemplateTab = mongoose.Schema({ 
    ...AppResource.schema.obj,
    forms:{
        type: Map,
        of: AppResourceForm
    },
    grids:{
        type: Map,
        of: AppResourceGrid
    }
});


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppResourceTemplateTab;