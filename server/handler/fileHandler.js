const Config = require("../enum/config");
const AWSHelper = require("./awsHelper");
const LocalStorageFileHandler = require("./localStorageFileHandler");

const awsHelper = new AWSHelper();
const localStorageFileHandler = new LocalStorageFileHandler();

class FileHandler {
    handleUploadThroughExcel(coll, object, user, jsonObject){
        if (coll.toLowerCase() == "upload_data") {
            // FileData newObject = new FileData();
            // newObject.setFileType(BeanUtils.getProperty(object, "fileType"));
            // newObject.setUploadTemplateName(BeanUtils.getProperty(object, "uploadTemplateName"));
            // newObject.setUploadStatus("uploading");
            // String _id = newObject.get_id();
            // CompletableFuture.supplyAsync(() -> {
            //     try {
            //         FileData fileData = (FileData)this.jsonMessageConverter.getObjectMapper().convertValue(object, new TypeReference<FileData>() {
            //         });
            //         Map<String, Object> uploadResult = this.handleFileUploadForBulkAccount(fileData, user);
            //         Object resultObject = uploadResult.get("data");
            //         return new JSONObject((new Gson()).toJson(resultObject));
            //     } catch (Exception var6) {
            //         this.logger.info("Error while upload Excel file data");
            //         return new JSONObject();
            //     }
            // }).thenAccept((obj) -> {
            //     this.inComingDataHandler.updateObjectInDatabase(_id, obj);
            // });
            // return new JSONObject(this.gson.toJson(newObject));
            return {};
        } else {
            return jsonObject;
        }
    }
    async create_file_based_file_system(bucket, uploadData) {
        let folderCreated = false;
        if(Config.FILE_SYSTEM == 'S3') {
            console.log( "Creating a new file on S3 in bucket {} with key {}"+ bucket + uploadData.innerBucketPath );
            const result = await awsHelper.saveFileToS3(bucket,uploadData);
            if(result){
                folderCreated=true;
            }
        }else{
            console.log( "Creating a new file in FileSystem {} with key {}", bucket + uploadData.innerBucketPath );
            const result = await localStorageFileHandler.saveFileToStorage( bucket,uploadData);
            if(result.success){
                folderCreated=true;
            }
        }
        return folderCreated;
    }

}

module.exports = FileHandler;