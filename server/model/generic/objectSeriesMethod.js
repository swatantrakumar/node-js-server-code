const mongoose = require('mongoose');

// Creating user schema
const ObjectSeriesMethodSchema = mongoose.Schema({ 
    applicable_pojos:[String],
    series:String,
    pattern:String,
    series_type:String,
    on_date:String,
    exDept:[String],
    exDeptSeriesType:String 
});


module.exports = ObjectSeriesMethodSchema;