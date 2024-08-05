const mongoose = require('mongoose');
const TemplateTabSchema = require('./templateTabSchema');


// Combine the base entity schema with the user schema
const TemplateTab =  mongoose.model('TemplateTab', TemplateTabSchema,'app_template_tab');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = TemplateTab;