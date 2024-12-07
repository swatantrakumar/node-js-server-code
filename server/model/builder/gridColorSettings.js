const mongoose = require('mongoose');
const Reference = require('../reference');

// Creating user schema
const GridColorSettings = mongoose.Schema({ 
    colorReference:Reference,
    crList:[String]
});


// / Define the virtual field
GridColorSettings.virtual('typoGraphy')
    .get(function () {
        return this._typoGraphy;
    })
    .set(function (value) {
        this._typoGraphy = value;
    });


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = GridColorSettings;