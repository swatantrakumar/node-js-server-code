const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const PdfEventSchema = require('./pdfEventSchema');

// Creating user schema
const ClientsPdfEventsSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    key:String,
    pdfEvent:PdfEventSchema
});

// Combine the base entity schema with the user schema
const ClientsPdfEvents =  mongoose.model('ClientsPdfEvents', ClientsPdfEventsSchema,'config_pdf_events');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = ClientsPdfEvents;