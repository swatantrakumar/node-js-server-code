const mongoose = require('mongoose');
const AppResource = require('./appResource');
const AppResourceTemplateTab = require('./appResourceTemplateTab');

// Creating user schema
const AppResourceMenu = mongoose.Schema({ 
    ...AppResource.schema.obj,
    submenus:{
        type: Map,
        of: this
    },
    templateTabs:{
        type: Map,
        of: AppResourceTemplateTab
    }
});

    AppResourceMenu.virtual('details')
    .get(function () {
        return this._details;
    })
    .set(function (value) {
        this._details = value;
    });

    AppResourceMenu.virtual('submenuMap')
    .get(function () {
        return this._menuMap;
    })
    .set(function (value) {
        this._menuMap = value;
    });
    AppResourceMenu.virtual('templateTabMap')
    .get(function () {
        return this._menuMap;
    })
    .set(function (value) {
        this._menuMap = value;
    });


    AppResourceMenu.set('toJSON', {
        virtuals: true,
        versionKey: false,  // remove __v
        transform: function (doc, ret) {   
            delete ret.id;   // remove `id` field
            return ret;
        }
    });


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppResourceMenu;