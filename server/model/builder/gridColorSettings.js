const mongoose = require('mongoose');
const Reference = require('../reference');

// Creating user schema
const GridColorSettings = mongoose.Schema({ 
    colorReference:Reference,
    crList:[String]
});


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = GridColorSettings;