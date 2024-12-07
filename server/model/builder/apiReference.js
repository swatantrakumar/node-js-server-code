const mongoose = require('mongoose');

// Creating user schema
const APIReference = mongoose.Schema({ 
    api:String ,
    payloads_fields:[String],
    callback:String,
    action_name:String,
    close_form_on_success:Boolean,
    success_msg:String ,
    error_msg:String ,
    templateType:String
});


// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = APIReference;