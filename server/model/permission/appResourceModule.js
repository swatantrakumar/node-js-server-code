const mongoose = require('mongoose');
const AppResource = require('./appResource');
const AppResourceMenu = require('./appResourceMenu');

// Creating user schema
const AppResourceModule = mongoose.Schema({ 
    ...AppResource.schema.obj,
    menus:{
        type: Map,
        of: AppResourceMenu
    }
});


    AppResourceModule.virtual('details')
    .get(function () {
        return this._details;
    })
    .set(function (value) {
        this._details = value;
    });

    AppResourceModule.virtual('menuMap')
    .get(function () {
        return this._menuMap;
    })
    .set(function (value) {
        this._menuMap = value;
    });


    AppResourceModule.set('toJSON', {
        virtuals: true,
        versionKey: false,  // remove __v
        transform: function (doc, ret) {   
            delete ret.id;   // remove `id` field
            return ret;
        }
    });


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppResourceModule;