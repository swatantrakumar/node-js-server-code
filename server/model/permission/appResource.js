// Importing modules
const mongoose = require('mongoose');
const Reference = require('../reference');


// Creating BaseEntity schema
const AppResourceSchema = mongoose.Schema({
    reference:Reference,
    criteria:AppResourceCriteria,
    favourite:Boolean
});


// Exporting module to allow it to be imported in other files
const AppResource = mongoose.model('AppResource', AppResourceSchema);

module.exports = AppResource;