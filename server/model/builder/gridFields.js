const mongoose = require('mongoose');
const GridFieldsSchema = require('./gridFieldsSchema');

// Combine the base entity schema with the user schema
const GridFields =  mongoose.model('GridFields', GridFieldsSchema,'el_grid_fields');


module.exports = GridFields;