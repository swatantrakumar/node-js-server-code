const NotifierController = require("../notifierServer/controllers/notifierController");
const cacheService = require("./cacheService");
// const cacheService = new CacheService();

const notifierController = new NotifierController();
class LoadCache {
    
    static async refreshCache(){
       await cacheService.cacheStaticData();
       this.startNotifier();
    }

    static startNotifier(){
        notifierController.startPolling();
    }
}
module.exports = LoadCache;