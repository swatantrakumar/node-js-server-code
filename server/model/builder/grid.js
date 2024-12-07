const mongoose = require('mongoose');
const GridSchema = require("./gridSchema");

// Combine the base entity schema with the user schema
const Grid =  mongoose.model('Grid', GridSchema,'el_object_grid_view');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = Grid;