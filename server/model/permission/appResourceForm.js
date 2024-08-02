const mongoose = require('mongoose');
const AppResource = require('./appResource');
const AppResourceGrid = require('./appResourceGrid');

// Creating user schema
const AppResourceForm = mongoose.Schema({ 
    ...AppResource.schema.obj,
    forms:{
        type: Map,
        of: this
    },
    grids:{
        type: Map,
        of: AppResourceGrid
    }
});


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppResourceForm;