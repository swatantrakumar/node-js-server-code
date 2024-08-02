// Importing modules
const mongoose = require('mongoose');


// Creating BaseEntity schema
const AppResourceCriteria = mongoose.Schema({
    crList:[],
    userCrList:[],
    selfData:Boolean
});

module.exports = AppResourceCriteria;