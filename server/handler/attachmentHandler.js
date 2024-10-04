const cacheService  = require('../cache/cacheService');
const {ObjectId} = require('mongodb');
const S3FolderData = require('../model/generic/S3FolderData');
const CommonUtils = require('../utils/commonUtils');
const Config = require('../enum/config');
const s3Handler = require('./s3Handler');
const FileHandler = require('./fileHandler');
const CollectionHandler = require('./collectionHandler');


const utils = new CommonUtils();
const s3Helper = new s3Handler();
const fileHandler = new FileHandler();
const collectionHandler = new CollectionHandler();

class AttachmentHandler {
    async handleAssociatedFile(collection, jsonObject, field){ 
        try {
            let list = this.getFileFieldListForCollection(collection);
            await Promise.all(list.map(async fileField => {         
                const splittedFileField = fileField.split('.');
                const parentFieldName = splittedFileField[0];                
                let childField = "";
                let fieldType = "";
                let mainJson = {};
                if(splittedFileField.length > 1){                    
                    try {
                        mainJson = JSON.parse(JSON.stringify(jsonObject));
                        const value = mainJson[parentFieldName];
                        if (value !== undefined) {
                            fieldType = typeof value;
                        }
                        if(fieldType == 'object'){
                            mainJson = jsonObject[parentFieldName];
                            childField = splittedFileField[1];
                            fileField =  splittedFileField[1];
                            this.prepareMainJson(mainJson, jsonObject);
                            await this.uploadAndUseS3Object(collection, jsonObject, field, fileField, parentFieldName, childField, fieldType, mainJson,-1);
                        }else if(fieldType.equals("JSONArray")){
                            const uploadFilesList = jsonObject[parentFieldName];

                            // Check if it's an array
                            if (Array.isArray(uploadFilesList)) {
                                for(let x=0; x<uploadFilesList.length(); x++){
                                    mainJson = uploadFilesList[x];
                                    childField = splittedFileField[1];
                                    fileField =  splittedFileField[1];
                                    this.prepareMainJson(mainJson, jsonObject);
                                    await this.uploadAndUseS3Object(collection, jsonObject, field, fileField, parentFieldName, childField, fieldType, mainJson,x);
                                }
                            }
                        }
                    } catch (error) {
                        console.log("Error while upload files");
                    }
                }else{
                    try {
                        mainJson = JSON.parse(JSON.stringify(jsonObject));
                        fileField =  splittedFileField[0];
                        await this.uploadAndUseS3Object(collection, jsonObject, field, fileField, parentFieldName, childField, fieldType, mainJson,-1);
                    } catch (e) {
                        console.log("Error while upload files uploadAndUseS3Object{}");
                    }
                }
            }));
        } catch (error) {
            console.error(error);
            console.log("Error while upload files");    
        } 
    }
    getFileFieldListForCollection(collection){
        const fileFields = [];
        let pojo = cacheService.getPojoFromCollection(collection);
        if(pojo && pojo.fileTypeFields){
            fileFields.push(...pojo.fileTypeFields);
        }
        if(fileFields.length == 0) {
            switch (collection) {
                case "patient":
                    fileFields.push("trf");
                    fileFields.push("prescription");
                    fileFields.push("test_report");
                    break;
                case "upload_data":
                    fileFields.push("uploadedFiles");
                    fileFields.push("resultantFiles");
                    break;
                default:
            }
        }
        fileFields.push("attachments");
        return fileFields;
    }
    prepareMainJson(mainJson, jsonObject){
        mainJson.refCode = jsonObject.refCode;
        mainJson.serialId = jsonObject.serialId;
        mainJson.series = jsonObject.series;
        mainJson.appId = jsonObject.appId;
        mainJson._id = new ObjectId().toString();
    }
    async uploadAndUseS3Object(collection, jsonObject, field, fileField, parentFieldName, childField, fieldType, mainJson,indexForJSONArrayType) {
        if(mainJson[fileField]){
            try {
                const attachmentList = this.getUploadData(mainJson, fileField); 
                const savedList = [];
                if(attachmentList && attachmentList.length > 0) {
                    for (let index = 0; index < attachmentList.length; index++) {
                        const element = attachmentList[index];
                        const attachment = new S3FolderData(JSON.parse(JSON.stringify(element)))
                        if (attachment && attachment.uploadData && Array.isArray(attachment.uploadData) && attachment.uploadData.length > 0 && attachment.uploadData[0]) {

                            const fileInfo = await this.getUploadDataWithAttach(collection, mainJson, field, attachment);
                            const bucketName = this.getBucketName(mainJson);
                            if (await fileHandler.create_file_based_file_system(bucketName, fileInfo)) {                                
                                await collectionHandler.insertDocument(attachment);
                                attachment.uploadData = null;
                                const attachementJson = JSON.parse(JSON.stringify(attachment));
                                attachementJson.folder = false;
                                savedList.push(attachementJson);
                            }
                        }else{
                            savedList.push(element);
                        }                        
                    }
                }
                if(fieldType == 'object'){
                    jsonObject[parentFieldName][childField] = savedList;
                }else if(fieldType == "Array"){
                    jsonObject[parentFieldName][indexForJSONArrayType][childField] = savedList;
                }
                else{
                    jsonObject[parentFieldName] = savedList;
                }
            } catch (error) {
               console.log(error.stack) 
            }
        }
    }
    getUploadData(jsonObject, fileField){
        let docList = null;
        try {
            if (jsonObject[fileField]) {
                docList = Array.isArray(jsonObject[fileField]) ? jsonObject[fileField] : [];
                if (docList && docList.length > 0) {
                    for (let docCount = 0; docCount < docList.length; docCount++) {
                        try {
                            if (docList[docCount].uploadData !== null && docList[docCount].uploadData !== undefined) {
                                const fileJsonObject = docList[docCount];
                                const fileObject = JSON.parse(JSON.stringify(fileJsonObject));
                                const fileData = new S3FolderData(fileObject);
    
                                const uploadArray = docList[docCount].uploadData;

                                uploadArray.forEach((object, i) => {
                                    object.fileData = fileData.uploadData[i].fileData;
                                });                                
                            }
                        }catch (e){
                            console.log("Error while getUploadData {}" + e.message);
                        }
                    }
                    delete jsonObject[fileField];
                }
            }
        }catch (e){
            console.log(e.stack);
        }
        return docList;
    }
    async getUploadDataWithAttach(collection, jsonObject, field, attachment){
        let fileInfo = attachment.uploadData[0];
        const fileFolder = this.attachKeyPrefix(jsonObject,collection);
        const fileName = fileInfo.fileName;
        const fileKey = fileFolder + "/" + fileName;

        const publicFile = jsonObject.publicFile ? jsonObject.publicFile : false;
        const publicBucket ="";

        if(publicFile){
            publicBucket = await s3Helper.publicS3BucketName();
            attachment.bucket = publicBucket ? publicBucket: Config.STORAGE_ROOT_PATH;
        } else
            attachment.bucket = Config.STORAGE_ROOT_PATH;


        attachment.key = fileKey;
        attachment.capKey = fileKey.toUpperCase();
        attachment.caseId = jsonObject._id;
        attachment.rollName = fileInfo.fileName;
        attachment.fileExt = fileInfo.fileExtn;
        attachment.type = field == null ? collection : field;
        fileInfo.innerBucketPath = fileKey;
        return fileInfo;
    }
    attachKeyPrefix(jsonObject, collection) { 
        let path = Config.AWS.BUCKET_PREFIX; 
        const split = path.split('/');

        // Iterate through each component (skip the first one)
        split.slice(1).forEach(key => {
            if (utils.hasKeyInJsonObject(jsonObject, key)) {
                try {
                    // Replace the key in the path with the value from jsonObject
                    path = path.replace(key, jsonObject[key]);
                } catch (error) {
                    console.error("Error while preparing path for file upload");
                }
            } else {
                switch (key) {
                    case "COLLECTION":
                        // Replace "COLLECTION" with the provided collection value
                        path = path.replace(key, collection);
                        break;
                    default:
                        // Replace other keys with "failed"
                        path = path.replace(key, "failed");
                }
            }
        });

        return path;
    }
    getBucketName(jsonObject){
        let bucketName = Config.STORAGE_ROOT_PATH;
        try {
            const publicBucket = s3Helper.publicS3BucketName();
            if (this.isPublicFile(jsonObject)) {
                bucketName = publicBucket && publicBucket.trim() !== '' ? publicBucket : Config.STORAGE_ROOT_PATH;
            } else bucketName = Config.STORAGE_ROOT_PATH;
        }catch (e){
            console.error(e.stack);
        }
        return bucketName;
    }
    isPublicFile(jsonObject) {
        try {
            return jsonObject.publicFile ? jsonObject.publicFile : false;
        } catch (error) {
            console.error("Error checking if the file is public: ", error);
            return false;
        }
    }
    getAttachmentLink(folder){
        if(Config.FILE_SYSTEM == 'S3') {
            return s3Helper.getPresignedURL(s3Helper.getS3Client(), Config.STORAGE_ROOT_PATH, folder.key);
        }else{
            const filePath = process.cwd().replace(/\\/g, '/') +'/'+ folder.key;  
            return filePath;
        }
    }
    // handleAlertAttachement(){
    //     if(alert.attachments && Array.isArray(alert.attachments) && alert.attachments.length > 0) {
    //         alert.attachment = true;
    //         let files = [];
    //         for(let i = 0; i< alert.attachments.length; i++) {
    //             let attachment = alert.attachments[i];
    //             let alertAttachment = new AlertAttachment();
    //             alertAttachment.set_id(new ObjectId().toString());
    //             alertAttachment.setAlertId(alert.get_id());
    //             alertAttachment.setDocExtn(attachment.getFileExt());
    //             alertAttachment.setFileName(attachment.getRollName());
    //             if(attachment.getUploadData()!=null && attachment.getUploadData().size()>0){
    //                 if(attachment.getUploadData().get(0).getFileData()!=null) {
    //                     UploadData data = attachment.getUploadData().get(0);
    //                     alertAttachment.setDocument(data.getFileData());
    //                     alertAttachment.setDocExtn(data.getFileExtn());
    //                     alertAttachment.setFileName(attachment.getFileName()==null?utils.getDateTimeIndia():attachment.getFileName());

    //                 }
    //             }else if(attachment.getKey()!=null){
    //                 alertAttachment.setDocument(getByteArrayFromS3ObjectKey(attachment.getKey()));
    //             }
    //             files.add(alertAttachment);
    //         }
    //         collectionHandler.insertAllDocuments(files,notifierDb);
    //     }
    // }
}
module.exports = AttachmentHandler;