const path = require('path');
const { pathToFileURL } = require('url');
const Config = require('../enum/config');
const ClientConfiguration = require('../model/generic/clientConfiguration');
const ExportConfiguration = require('../model/generic/exportConfiguration');
const PojoMaster = require('../model/generic/pojoMaster');
const CommonUtils = require('../utils/commonUtils');
const ApplicationProperties = require('../model/generic/applicationProperties');

const commonUtil = new CommonUtils();

class CacheService {
    constructor() {
        if (!CacheService.instance) {
            this.cache = new Map();
            this.pojoMap = new Map();
            this.fieldMap = new Map();
            this.userIdWithAppRoleIds = new Map();
            this.rollIdWithCriteriaList = new Map();
            this.userIdWithTemplateTabIdMap = new Map();
            this.userIdWithFevouriteTemplateTabIdMap = new Map();
            this.export_configuration = new Map();
            this.application_properties = new Map();
            this.clientConfigurations = new Map();
            this.activeUserJSONMap = new Map();
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
      await this.prepareClientConfiguration();
      await this.prepareApplicationProperties();
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
        const collection = this.pojoMap.get(collectionName)?.pojo;
        if (!collection) {
            return null;
        }
        return collection;
    }
    async getModel(collectionName) {
      const modelPath = this.getModulePath(collectionName);
      let model = null;
      if(modelPath){
          const filePath = Config.PACKAGE_PATH + modelPath +'.js';
          const projectRoot = process.cwd();
          const absolutePath = path.resolve(projectRoot, filePath);

          // Validate the file path and extension
          if (!absolutePath.endsWith('.js') && !absolutePath.endsWith('.mjs')) {
              throw new Error('The file path must end with .js or .mjs');
          }

          // Convert the absolute path to a file URL
          const fileUrl = pathToFileURL(absolutePath).href;
          try {
            const file = await import(fileUrl);
            model =  file.default;
          } catch (error) {
            console.log(error);
          }    
      }
      return model;
    }
    getModulePath(colName){
      let modulePath = null;
      const pojo = this.getPojoFromCollection(colName);
      if(pojo && pojo.class_name){
          modulePath = pojo?.class_name;
      }
      return modulePath;
    }
    getFieldMap() {
      return this.fieldMap;
    }
    async prepareExportConfiguration() {
      const exportConfigurationList = await ExportConfiguration.find({}).exec();
      if(exportConfigurationList && Array.isArray(exportConfigurationList) && exportConfigurationList.length > 0){
          exportConfigurationList.forEach(config => {
              this.export_configuration.set(config.name == null ? config.collectionName.toUpperCase():config.name.toUpperCase(),config);
          });
          console.log("ExportConfiguration List Cached...");
      }else{
        console.log("ExportConfiguration List not exists...");
      }
    }
    async prepareClientConfiguration(){
      const clientConfigurationList = await ClientConfiguration.find({}).exec();
        if (clientConfigurationList && Array.isArray(clientConfigurationList) && clientConfigurationList.length > 0) {
            clientConfigurationList.forEach((config) => {
                this.clientConfigurations.set(config.refCode, config);
            });
            console.log("ClientConfiguration List Cached..");
        }else{
          console.log("ClientConfiguration List not exists..");
        }        
    }
    async prepareApplicationProperties(){
      const applicationPropertiesList = await ApplicationProperties.find({}).exec();
        if (applicationPropertiesList && Array.isArray(applicationPropertiesList) && applicationPropertiesList.length > 0) {
            applicationPropertiesList.forEach((obj) => {
                this.application_properties.set(obj.key, obj.value);
            });
            console.log("applicationProperties List Cached..");
        }else{
          console.log("applicationProperties List not exists..");
        }        
    }
    
    retriveAsStringList(col) {
      const colLowerCase = col.toLowerCase();
      if (this.pojoMap.get(colLowerCase) != null) return this.pojoMap.get(colLowerCase).pick_as_string;
      return false;
    }
    getConfiguration(refCode, type) {
      return this.clientConfigurations != null && this.clientConfigurations[refCode] != null && this.clientConfigurations[refCode].settings != null ? this.clientConfigurations[refCode].settings[type] : null;
    }
    
    populateUserJsonInStaticDataCache(user){
        const fieldsToBeTakenForUser =["name","email","code","mobile1","branch"];
        const userJson = JSON.parse(JSON.stringify(user));
        const newUser = {};
        fieldsToBeTakenForUser.forEach(field=>{
            commonUtil.populateFieldFromTo(userJson,newUser,field);
        });
        this.activeUserJSONMap.set(user.email.toLowerCase(),newUser);
    }
    getActiveUserJSONMap() {
      return this.activeUserJSONMap;
    }
    getPojoScope(col) {
      const colLowerCase = col.toLowerCase();
      const pojoMaster = this.getPojoFromCollection(colLowerCase);
      if(pojoMaster && pojoMaster?.scope){
        return pojoMaster?.scope
      }else{
        return '';
      }
    }
    getPrimaryKeysForPojo(name){
      const pojoMaster = this.getPojoFromCollection(name);
      if(pojoMaster.primaryKeys && Array.isArray(pojoMaster.primaryKeys) && pojoMaster.primaryKeys.length > 0){
          return pojoMaster.primaryKeys;
      }
      return null;
    }
    getSeriesMethod(refCode, pojo){
      try {
          if (this.clientConfigurations && this.clientConfigurations.get(refCode) && this.clientConfigurations.get(refCode).series_methods) {
              const seriesMethod = this.clientConfigurations.get(refCode).series_methods.filter(exportedFileName => exportedFileName.applicable_pojos.includes(pojo)).shift();
              return seriesMethod;
          }
      }catch (e){
          console.log("Error while fetching pdf name pattern");
      }
      return null;
    }
    async getApplicationProperties(key) {
        if(this.application_properties.has(key)){
          return this.application_properties.get(key);
        }else{
          return null;
        }      
    }
    
  }
  // Ensure the singleton pattern
const instance = new CacheService();
Object.freeze(instance);
  
  module.exports = instance;