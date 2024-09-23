const mongoose = require('mongoose');
const SearchCriteriaSchema = require('./searchCriteria');
const Schema = mongoose.Schema;

const ColumnListSchema = new Schema({
    label: { type: String },
    columnType: { type: String },
    columnValue: { type: String },
    defaultValue: { type: String },
    createDefaultReference: { type: Boolean, default: true },
    position: { type: Number },
    columnName: { type: String },
    convertValueCaseTo: { type: String },
    separator: { type: String },
    columnHeading: { type: String },
    collectionName: { type: String },
    format: { type: String },
    source_format: { type: String },
    fieldsFromObject: [{ type: String }],
    index: { type: Number },
    additionalDetails: {
        type: Map,
        of: String
    },
    columnList: [this],
    updateable: { type: Boolean },
    searchCriteriaList: [SearchCriteriaSchema],
    conditions: [{
        // Define the ConditionalCriteria schema if needed
    }],
    value: Schema.Types.Mixed, // Use Mixed for Object type
    image_height: { type: Number },
    image_width: { type: Number },
    columnColor: { type: Number, min: -32768, max: 32767 } // short equivalent in Java is 16-bit integer
});

ColumnListSchema.methods.toString = function() {
    return `ColumnList{columnType='${this.columnType}', columnValue='${this.columnValue}', defaultValue='${this.defaultValue}', createDefaultReference=${this.createDefaultReference}, position=${this.position}, columnName='${this.columnName}', convertValueCaseTo='${this.convertValueCaseTo}', separator='${this.separator}', columnHeading='${this.columnHeading}', collection='${this.collection}', fieldsFromObject=${this.fieldsFromObject}, index=${this.index}, additionalDetails=${this.additionalDetails}, columnList=${this.columnList}}`;
};

module.exports =  ColumnListSchema;