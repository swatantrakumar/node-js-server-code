const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SearchCriteriaSchema = new Schema({
    fName:String,
    fValue:String,
    fieldType:String,
    operator:String,
    searchCriteria:[this]
});

module.exports = SearchCriteriaSchema;