const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");

// Creating user schema
const AdditionalMasterSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    type:String ,
    name:String ,
    value:String ,
    keyValue:{type:Map,of:String},
    desc:String ,
    val1:String ,
    val2:String ,
    val3:String ,
    alt_desc:String ,
    altvalue:String ,
    parent_id:String ,
    parent_serial:String 
    
});


// Combine the base entity schema with the user schema
const AdditionalMaster =  mongoose.model('AdditionalMaster', AdditionalMasterSchema,'app_ad_masters');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AdditionalMaster;