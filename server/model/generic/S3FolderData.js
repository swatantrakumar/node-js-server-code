const mongoose = require('mongoose');
const S3FolderDataSchema = require('./S3FolderSchema');
// Combine the base entity schema with the user schema
const S3FolderData =  mongoose.model('S3FolderData', S3FolderDataSchema,'app_aws_docs');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = S3FolderData;
