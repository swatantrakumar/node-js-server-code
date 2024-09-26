// Importing modules
const mongoose = require('mongoose');


// Creating BaseEntity schema
const AppResourceCriteria = mongoose.Schema({
    crList:[],
    userCrList:[],
    selfData:Boolean
}, { _id: false });

module.exports = AppResourceCriteria;