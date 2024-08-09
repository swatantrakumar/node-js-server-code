const mongoose = require('mongoose');

const ClassFields = mongoose.Schema({
    key:String,
    label:String,
    type:String
});

module.exports = ClassFields;