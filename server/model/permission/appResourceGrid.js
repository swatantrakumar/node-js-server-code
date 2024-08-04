const mongoose = require('mongoose');
const AppResource = require('./appResource');
const GridFieldsSchema = require('../builder/gridFieldsSchema');

// Creating user schema
const AppResourceGrid = mongoose.Schema({ 
    ...AppResource.schema.obj,
    fields:[GridFieldsSchema]
});


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppResourceGrid;