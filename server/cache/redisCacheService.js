const redis = require('redis');
const { promisify } = require('util');

// Redis client setup
const client = redis.createClient({
    socket: {
        host: '127.0.0.1', // Default Redis host (localhost)
        port: 6379         // Default Redis port
    }
});

// Handle connection errors
client.on('error', (err) => {
    console.error('Redis client connection error:', err);
});

// Connect to Redis
async function connectRedis() {
    try {
        if (!client.isOpen) {
            await client.connect();  // Ensure the client is connected
            console.log('Redis client connected');
        }
    } catch (err) {
        console.error('Redis client connection error:', err);
    }
}


// Promisify Redis commands
const hsetAsync = promisify(client.hSet).bind(client);
const lpushAsync = promisify(client.lPush).bind(client);
const lrangeAsync = promisify(client.lRange).bind(client);
const hgetAsync = promisify(client.hGet).bind(client);
const existsAsync = promisify(client.exists).bind(client);
const delAsync = promisify(client.del).bind(client);
const flushallAsync = promisify(client.flushAll).bind(client);


// RedisCacheService class definition
class RedisCacheService {

    // Ensure Redis connection
  async ensureConnected() {
    if (!client.isOpen) {
        await connectRedis();
    }
  }
  
  // Helper function to create Redis namespace key using model name
  createNamespaceKey(model) {
    const modelName = this.getModelName(model);
    return `namespace:${modelName}`;
  }

  // Function to get the model name dynamically
  getModelName(model) {
    return model.modelName || model.name || model;
  }

  // Mock function to simulate collection handler (to be replaced with real DB call)
  async fetchFromCollectionHandler(model, fields) {
    const modelName = this.getModelName(model);
    console.log(`Fetching ${modelName} data from collection with fields:`, fields);
    // Simulate a database call with mock data
    return [
      
    ];
  }

  // Function to cache data dynamically in Redis based on model and key
  async cacheInNamespace(model, key, value) {
    await this.ensureConnected();  // Ensure the client is connected

    const namespaceKey = this.createNamespaceKey(model);

    if (key) {
      // Store key-value pair (object) in Redis
      await hsetAsync(namespaceKey, key, JSON.stringify(value));
      console.log(`Cached ${key} in namespace ${this.getModelName(model)}`);
    } else if (Array.isArray(value)) {
      // Store list in Redis list
      for (const item of value) {
        await lpushAsync(namespaceKey, JSON.stringify(item));
      }
      console.log(`Cached list in namespace ${this.getModelName(model)}`);
    } else {
      throw new Error('To cache a list, provide an array of values without a key.');
    }
  }

  // Function to get data by key, or fetch from collection handler if not in cache
  async getDataFromCacheOrCollection(model, keyValue='', keyField='', fields=[]) {
    await this.ensureConnected();  // Ensure the client is connected

    const namespaceKey = this.createNamespaceKey(model);

    // Check if data is available in Redis
    let cachedData = await hgetAsync(namespaceKey, keyValue);
    if (cachedData) {
      console.log(`Data for key ${key} found in cache`);
      return JSON.parse(cachedData);
    }

    // Cache miss: Fetch from collection handler
    console.log(`Data for key ${key} not found in cache, fetching from collection...`);
    const dataFromCollection = await this.fetchFromCollectionHandler(model, fields);

    // Store fetched data in Redis cache
    if(keyField){
        if(dataFromCollection && dataFromCollection.length > 0){
            for (const data of dataFromCollection) {
                let keyValue = null;
                if(keyField){
                    keyValue = data[keyField];
                }            
                await this.cacheInNamespace(model, keyValue, data);
            }
        }
    }else{
        await this.cacheInNamespace(model, null, dataFromCollection);
    }

    return dataFromCollection;
  }

  // Function to get list data or fetch from collection if not cached
  async getListDataFromCacheOrCollection(model, fields) {
    await this.ensureConnected();  // Ensure the client is connected

    const namespaceKey = this.createNamespaceKey(model);

    // Check if list data exists in Redis
    const exists = await existsAsync(namespaceKey);
    if (exists) {
      // Retrieve the list from Redis
      const listData = await lrangeAsync(namespaceKey, 0, -1);
      return listData.map(item => JSON.parse(item));
    }

    // Cache miss: Fetch list data from collection handler
    console.log(`List data for ${this.getModelName(model)} not found in cache, fetching from collection...`);
    const listDataFromCollection = await this.fetchFromCollectionHandler(model, fields);

    // Cache the list data in Redis
    await this.cacheInNamespace(model, null, listDataFromCollection);

    return listDataFromCollection;
  }

  // Function to clear all Redis data
  async clearAllCache() {
    await this.ensureConnected();  // Ensure the client is connected

    await flushallAsync();
    console.log('All Redis cache cleared.');
  }

  // Function to clear cache for a specific model
  async clearCacheForModel(model) {
    await this.ensureConnected();  // Ensure the client is connected

    const namespaceKey = this.createNamespaceKey(model);
    await delAsync(namespaceKey);
    console.log(`Cache for ${this.getModelName(model)} cleared.`);
  }
}

// Export the RedisCacheService instance
module.exports = new RedisCacheService();