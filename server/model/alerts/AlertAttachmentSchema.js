const mongoose = require('mongoose');
const path = require('path');
const BaseEntity = require("../baseEntity");
const IgnoreNull = require('../ignoreNull');


// Creating user schema
const AlertAttachmentSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    alertId:String,
    fileName:String,
    docExtn:String,
    comment:String
});

// Add a static property for file path
AlertAttachmentSchema.statics.modelFilePath = path.relative(process.cwd(), __filename);


AlertAttachmentSchema.plugin(IgnoreNull);

module.exports = AlertAttachmentSchema;