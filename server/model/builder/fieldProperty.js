const mongoose = require('mongoose');

// Creating user schema
const FieldProperty = mongoose.Schema({ 
    toolTip:String,
    label:String,
    ngClass:String
});


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = FieldProperty;