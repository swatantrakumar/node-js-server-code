const path = require('path');
const { pathToFileURL } = require('url');
const cacheService = require('../cache/cacheService');
const Config = require('../enum/config');


class CommonUtils {
// Function to dynamically import models based on path
    async getModel(collectionName) {
        const modelPath = this.getModulePath(collectionName);
        let model = null;
        if(path){
            const filePath = Config.PACKAGE_PATH + modelPath +'.js';
            const projectRoot = process.cwd();
            const absolutePath = path.resolve(projectRoot, filePath);

            // Validate the file path and extension
            if (!absolutePath.endsWith('.js') && !absolutePath.endsWith('.mjs')) {
                throw new Error('The file path must end with .js or .mjs');
            }

            // Convert the absolute path to a file URL
            const fileUrl = pathToFileURL(absolutePath).href;

            const file = await import(fileUrl);
            model =  file.default;
        }
        return model;
    }
    decodeBase64(encodeData){
        return JSON.parse(Buffer.from(encodeData, 'base64').toString('utf-8'));
    }
    getModulePath(colName){
        let modulePath = null;
        const pojo = cacheService.getPojoFromCollection(colName);
        if(pojo && pojo.pojo.class_name){
            modulePath = pojo?.pojo?.class_name;
        }
        return modulePath;
    }
    getReference(obj){
        let ref = {};
        if(obj?._id) ref['_id'] = obj._id;
        if(obj?.code) ref['code'] = obj.code;
        if(obj?.serialId) ref['serialId'] = obj.serialId;
        if(obj?.name) ref['name'] = obj.name;
        return ref;
    }
}

module.exports = CommonUtils;