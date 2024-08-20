const mongoose = require('mongoose');
const clientLogSchema = require('./clientLog');

// Define the UploadData schema
const uploadDataSchema = new mongoose.Schema({
    fileData: { type: Buffer }, // Binary data
    publicFile: { type: Boolean, default: false }, // Boolean with default value
    publicUrl: { type: String }, // String
    innerBucketPath: { type: String }, // String
    fileName: { type: String }, // String
    fileExtn: { type: String }, // String
    toEmailList: { type: [String] }, // Array of strings
    ccEmailList: { type: [String] }, // Array of strings
    bccEmailList: { type: [String] }, // Array of strings
    additionalDetails: { type: Map, of: String }, // Map with string keys and values
    log: { type: clientLogSchema } // Nested object
});

module.exports = uploadDataSchema;