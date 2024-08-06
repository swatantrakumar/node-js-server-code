const mongoose = require('mongoose');
const AppResource = require('./appResource');
const AppResourceGrid = require('./appResourceGrid');
const AppResourceForm = require('./appResourceForm');

// Creating user schema
const AppResourceTemplateTab = mongoose.Schema({ 
    ...AppResource.schema.obj,
    forms:{
        type: Map,
        of: AppResourceForm
    },
    grids:{
        type: Map,
        of: AppResourceGrid
    }
});

    AppResourceTemplateTab.virtual('details')
    .get(function () {
        return this._details;
    })
    .set(function (value) {
        this._details = value;
    });

    AppResourceTemplateTab.virtual('access')
    .get(function () {
        return this._access;
    })
    .set(function (value) {
        this._access = value;
    });
    AppResourceTemplateTab.virtual('label')
    .get(function () {
        return this._label;
    })
    .set(function (value) {
        this._label = value;
    });
    AppResourceTemplateTab.virtual('grid')
    .get(function () {
        return this._grid;
    })
    .set(function (value) {
        this._grid = value;
    });


    AppResourceTemplateTab.set('toJSON', {
        virtuals: true,
        versionKey: false,  // remove __v
        transform: function (doc, ret) {   
            delete ret.id;   // remove `id` field
            return ret;
        }
    });




// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = AppResourceTemplateTab;