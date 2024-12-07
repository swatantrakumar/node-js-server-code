const mongoose = require('mongoose');
const { Schema } = mongoose;


const mapOfStringObject = mongoose.Schema({
    key: String,
    value: Schema.Types.Mixed
});

module.exports = mapOfStringObject;