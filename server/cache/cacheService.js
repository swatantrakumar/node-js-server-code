// server/CacheService.js
const ExportConfiguration = require('../model/generic/exportConfiguration');
const PojoMaster = require('../model/generic/pojoMaster');

class CacheService {
    constructor() {
        if (!CacheService.instance) {
            this.cache = new Map();
            this.pojoMap = new Map();
            this.fieldMap = new Map();
            this.userIdWithAppRoleIds = new Map();
            this.userIdWithTemplateTabIdMap = new Map();
            this.userIdWithFevouriteTemplateTabIdMap = new Map();
            this.export_configuration = new Map();
            this.coreModuleList = [];
            CacheService.instance = this;
          }
      
          return CacheService.instance;
    //   this.cache = new Map();
    //   this.pojoMap = new Map();

    //   // Bind methods to the instance
    //     this.getPojoFromCollection = this.getPojoFromCollection.bind(this);
    //     this.preparePojoMap = this.preparePojoMap.bind(this);
    }
  
    set(key, value, ttl = 3600) {
      const now = Date.now();
      const expiry = now + ttl * 1000;
      this.cache.set(key, { value, expiry });
      setTimeout(() => this.cache.delete(key), ttl * 1000);
    }
  
    get(key) {
      const now = Date.now();
      const cachedItem = this.cache.get(key);
  
      if (!cachedItem) {
        return null;
      }
  
      if (now > cachedItem.expiry) {
        this.cache.delete(key);
        return null;
      }
  
      return cachedItem.value;
    }
  
    delete(key) {
      this.cache.delete(key);
    }
  
    clear() {
      this.cache.clear();
    }
    async cacheStaticData(){
      await this.preparePojoMap();
      await this.prepareExportConfiguration();
    }
    async preparePojoMap(){
        try {
            const collection = await PojoMaster.find({}).exec();
            if(collection && collection.length > 0){
                const now = Date.now();
                const ttl = 3600
                const expiry = now + ttl * 1000;
                collection.forEach(pojo => {
                  const aliases = [];
                  aliases.push(pojo.name.toLowerCase());
                    const name =pojo.get('name').toLowerCase();
                    if(name){
                        this.pojoMap.set(name, {pojo,expiry});
                    }
                    if(pojo && pojo.aliasNames && pojo.aliasNames.length > 0){
                        pojo.aliasNames.forEach(colName => {
                            this.pojoMap.set(colName,{pojo,expiry});
                            aliases.push(colName.toLowerCase());
                        });
                    }   
                    if (pojo.listOfVariables && pojo.listOfVariables.length > 0) {
                      pojo.listOfVariables.forEach(variable => {
                          aliases.forEach(alias => {
                              this.fieldMap.set(alias + "_" + variable.key, variable.type);
                          });
                      });
                    }                 
                });
                console.log("Pojo master Prepared !!!");
            }
        } catch (error) {
           console.log("Error = " + error); 
        }
        
        
    }

    getPojoFromCollection(collectionName) {
        const collection = this.pojoMap.get(collectionName);
        if (!collection) {
            return null;
        }
        return collection;
    }
    getFieldMap() {
      return this.fieldMap;
    }
    async prepareExportConfiguration() {
      const exportConfigurationList = await ExportConfiguration.find({}).exec();;
      if(exportConfigurationList && Array.isArray(exportConfigurationList) && exportConfigurationList.length > 0){
          exportConfigurationList.forEach(config => {
              this.export_configuration.set(config.name == null ? config.collectionName.toUpperCase():config.name.toUpperCase(),config);
          });
          console.log("ExportConfiguration List Cached...");
      }else{
        console.log("ExportConfiguration List not exists...");
      }
    }
    retriveAsStringList(col) {
      const colLowerCase = col.toLowerCase();
      if (this.pojoMap.get(colLowerCase) != null) return pojoMap.get(colLowerCase).pick_as_string;
      return false;
    }
    
  }
  // Ensure the singleton pattern
const instance = new CacheService();
Object.freeze(instance);
  
  module.exports = instance;