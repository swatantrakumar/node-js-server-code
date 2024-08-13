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

}

module.exports = FileHandler;