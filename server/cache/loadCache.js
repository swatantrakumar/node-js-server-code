const cacheService = require("./cacheService");
// const cacheService = new CacheService();
class LoadCache {
    
    static async refreshCache(){
       await cacheService.cacheStaticData();
    }
}
module.exports = LoadCache;