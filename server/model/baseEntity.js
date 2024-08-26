// Importing modules
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');

<<<<<<< HEAD
// var objectId = new ObjectId();
=======
var objectId = new ObjectId();
>>>>>>> fe97f992c1a7be91fa0d0fceda288fabedd90555


// Creating BaseEntity schema
const BaseEntitySchema = mongoose.Schema({
<<<<<<< HEAD
    _id:{ type: String, default: () => new ObjectId().toString() },
=======
    _id:{ type: String, default: objectId },
>>>>>>> fe97f992c1a7be91fa0d0fceda288fabedd90555
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

BaseEntitySchema.virtual('favourite')
    .get(function () {
        return this._menuMap;
    })
    .set(function (value) {
        this._menuMap = value;
    });

    BaseEntitySchema.set('toJSON', {
        virtuals: true,
        versionKey: false,  // remove __v
        transform: function (doc, ret) {   
            delete ret.id;   // remove `id` field
            return ret;
        }
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