const cacheService = require('./../cache/cacheService');

class s3Handler {
    async publicS3BucketName(){
        return await cacheService.getApplicationProperties("publicS3BucketName");
    }
}
module.exports = s3Handler;