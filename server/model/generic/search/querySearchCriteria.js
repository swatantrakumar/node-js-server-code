// Importing modules
const mongoose = require('mongoose');


// Creating BaseEntity schema
const QuerySearchCriteria = mongoose.Schema({
    crList:[],
    userCrList:[],
    selfData:Boolean
});

module.exports = QuerySearchCriteria;