const mongoose = require('mongoose');
const path = require('path');
const BaseEntity = require("../baseEntity");
const FormFieldsSchema = require('../builder/formFieldsSchema');
const IgnoreNull = require('../ignoreNull');



// Creating user schema
const ModificationLogSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    object_id: { type: String},
    collection_name: { type: String},
    previous: { type: String },
    current: { type: String },
    previousObject: { type: Map, of: mongoose.Schema.Types.Mixed },
    currentObject: { type: Map, of: mongoose.Schema.Types.Mixed },
    // auditFields is transient and will not be stored in MongoDB
}, {
    toJSON: { virtuals: true,versionKey: false,  // remove __v
        transform: function (doc, ret) {   
        delete ret.id;   // remove `id` field
        return ret;
     }},
    toObject: { virtuals: true,versionKey: false,  // remove __v
        transform: function (doc, ret) {   
        delete ret.id;   // remove `id` field
        return ret;
     } }
});

ModificationLogSchema.virtual('auditFields', {
    ref: FormFieldsSchema,
    localField: '_id', // or any other field
    foreignField: 'parentField', // or any other field in FormFields
    justOne: false
});

ModificationLogSchema.statics.modelFilePath = path.relative(process.cwd(), __filename);


ModificationLogSchema.plugin(IgnoreNull);

// Combine the base entity schema with the user schema
const ModificationLog =  mongoose.model('ModificationLog', ModificationLogSchema,'app_modification_log');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = ModificationLog;