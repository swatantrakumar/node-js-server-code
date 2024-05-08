// Importing modules
const mongoose = require('mongoose');


// Creating BaseEntity schema
const BaseEntitySchema = mongoose.Schema({
    appId: String,
    refCode: String,
    createdBy:String,
    createdDate : { type: Date, default: Date.now },
    updatedBy : String,
    updateDate : { type: Date, default: Date.now }
});


// Exporting module to allow it to be imported in other files
const BaseEntity = mongoose.model('BaseEntity', BaseEntitySchema);

module.exports = BaseEntity;