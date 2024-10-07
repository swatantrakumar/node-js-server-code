const mongoose = require('mongoose');

// Assuming PdfEvent has two fields: name and timestamp
const PdfEventSchema = new mongoose.Schema({
    x: { type: Number },
    y: { type: Number },
    width: { type: Number },
    height: { type: Number },
    opacity: { type: Number },
    customImageSize: { type: Boolean },
    enabled: { type: Boolean, default: true },
    lineSpace: { type: Number },
    characterSpacing: { type: Number },
    wordSpacing: { type: Number },
    scaleAbsoluteWidth: { type: Number },
    scaleAbsoluteHeight: { type: Number },
    eventType: { type: String },
    url: { type: String },
    imageBytes: { type: Buffer }, 
    text: { type: String },
    defaultText: { type: String },
    location: { type: String },
    table: { type: mongoose.Schema.Types.Mixed }, // You can define a separate schema for PdfEventTable if needed
    rectangle: { type: mongoose.Schema.Types.Mixed }, // Define PdfRectangle schema separately if needed
    addPageNumber: { type: Boolean, default: true },
    pageNumber: [{ type: Number }], // List<Integer> in Java becomes an array of numbers in Mongoose
    customText: { type: Boolean, default: false },
    customTextFields: { type: Map, of: String }, // Map<String, String> in Java can be represented with Mongoose's Map type
    allPages: { type: Boolean },
    lastPage: { type: Boolean, default: false },
    fieldType: { type: String },
    fieldFormat: { type: String },
    font: { type: String },
    fontUrl: { type: String },
    fontColor: { type: String },
    boldFont: { type: Boolean, default: false },
    textUnderline: { type: Boolean, default: false },
    fontSize: { type: Number },
    sign: { type: mongoose.Schema.Types.Mixed }
});

module.exports = PdfEventSchema;