// Importing modules
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');

var objectId = new ObjectId();


// Creating BaseEntity schema
const BaseEntitySchema = mongoose.Schema({
    _id:{ type: String, default: objectId },
    print_template:String,
    remarks:String,
    cancel_reason:String,
    migrationStatus:String,
    series:String,
    srNumber:Number,
    serialId:String,
    customEntry:Boolean,
    status:String,
    version:Number,
    etc_fields:{
        type:Map,
        of:Object
    },
    appId: String,
    refCode: String,
    createdBy:String,
    createdDate : { type: Date, default: Date.now },
    createdByName:String,
    updatedBy : String,
    updatedDate : { type: Date },
    updatedByName : String
});

    // Add a pre middleware to update the updatedAt field before saving
    BaseEntitySchema.pre('save', function(next) {
        this.set({ createdDate: Date.now() });
        next();
    });

    BaseEntitySchema.pre('findOneAndUpdate', function(next) {
        this.set({ updatedDate: Date.now() });
        next();
    });

// Exporting module to allow it to be imported in other files
const BaseEntity = mongoose.model('BaseEntity', BaseEntitySchema);

module.exports = BaseEntity;