const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const DocPermissionSchema = require('../permission/docPermission');

// Creating user schema
const S3FolderDataSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    targetBucket:String,
    targetFolder:String,
    sourceBucket:String,
    sourceFolder:String,
    folderName:String,
    type:String,
    bucket:String,
    rollName:String,
    fileName:String,
    filePath:String,
    modifiedName:String,
    fileType:String,
    fileSize:Number,
    publicFilefalse:{type:Boolean,default:false},
    publicUrl:String,
    folder:Boolean,
    parentId:String,
    parentFolder:String,
    eTag:String,
    parentTag:String,
    key:String,
    capKey:String,
    fileExt:String,
    contentType:String,
    caseId:String,
    caseRoot:String,
    appIdRoot:String,
    refCodeRoot:String,
    caseDescription:String,
    pageCount:Number,
    readyFrView:Boolean,
    downLoadLink:String,
    accessPermission:DocPermissionSchema,
    reference:{type:Map,of:[String]},
    labels:[String]
});

// Combine the base entity schema with the user schema
const S3FolderData =  mongoose.model('S3FolderData', S3FolderDataSchema,'app_aws_docs');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = S3FolderDataSchema;