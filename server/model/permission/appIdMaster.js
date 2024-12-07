const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
// Creating user schema
const AppIdMasterSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    name:String
});

// Combine the base entity schema with the user schema
const AppIdMaster =  mongoose.model('AppIdMaster', AppIdMasterSchema,'app_app_id_master');


module.exports = AppIdMaster;