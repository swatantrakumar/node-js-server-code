const mongoose = require('mongoose');

// Creating user schema
const ExportedFileNameSchema = mongoose.Schema({ 
    applicable_pojos:[String],
    pattern:String
});


module.exports = ExportedFileNameSchema;