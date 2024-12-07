const mongoose = require('mongoose');

const DefaultApplicationSettings = mongoose.Schema({
    defaultSearchOperatorInGrid:String,
    defaultItemNoOfGrid:Number
});

module.exports = DefaultApplicationSettings;