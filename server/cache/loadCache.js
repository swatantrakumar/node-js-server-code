const cacheService = require("./cacheService");
// const cacheService = new CacheService();
class LoadCache {
    
    static async refreshCache(){
       await cacheService.preparePojoMap();
    }
}
module.exports = LoadCache;