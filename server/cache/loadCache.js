const cacheService = require("./cacheService");
// const cacheService = new CacheService();
class LoadCache {
    
    static refreshCache(){
        cacheService.preparePojoMap();
    }
}
module.exports = LoadCache;