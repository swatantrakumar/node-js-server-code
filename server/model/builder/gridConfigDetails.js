const mongoose = require('mongoose');
const mapOfStringObject = require('./mapOfString');
const BaseEntity = require('../baseEntity');

// Creating user schema
const GridConfigDetailsSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    clientId:String,
    collectionName:String,
    name:String,
    entityType:String,
    process_name:String,
    selenium_test_template:String,
    prerequisite:[String],
    additionalDetails:{
        type : Map,
        of : mapOfStringObject
        },
    columnDefs:[
        {
        type : Map,
        of : mapOfStringObject
        }
    ],
    gridOptions:{
        type : Map,
        of : mapOfStringObject
        }
});

const GridConfigDetails =  mongoose.model('GridConfigDetails', GridConfigDetailsSchema,'el_gridDetails');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = GridConfigDetails;