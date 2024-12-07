const mongoose = require('mongoose');

// Define the ClientLog schema
const clientLogSchema = new mongoose.Schema({
    user_id: { type: String },
    userId: { type: String },
    location: { type: [Number] }, // Array of numbers (e.g., coordinates)
    clientId: { type: String },
    source: { type: String },
    contactNo: { type: String },
    sessionId: { type: String },
    restPath: { type: String },
    additionalDetails: { type: Map, of: String }, // Map with string keys and values
    refCode: { type: String },
    appId: { type: String },
    email: { type: String },
    reqIp: { type: String }
});

// Create the model
// const ClientLog = mongoose.model('ClientLog', clientLogSchema);

module.exports = clientLogSchema;