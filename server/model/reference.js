const mongoose = require('mongoose');

const ReferenceSchema = mongoose.Schema({
    code:String,
    _id: { type: String, required: true },
    name:String,
    type:String,
    l1_parent_id:String,
    l2_parent_id:String,
    info:{
        type:Map,
        of:{}
    },
    version:Number,
    allSelected:Boolean,
    select:Boolean
})
const Reference = ReferenceSchema;

module.exports = Reference;