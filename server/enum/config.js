// Enum for various constant values in your project
const Config = {
    // MongoDB connection settings
    MONGODB_URI: 'mongodb://127.0.0.1:27017',
    DATABASE_NAME: 'central-elabs-prod',
    COLLECTION_NAME: 'yourCollectionName',
    
    // Other configuration values
    PORT: 3000,
    
    // User credentials (note: sensitive data like passwords should be handled carefully)
    DB_USER: 'yourDatabaseUsername',
    DB_PASSWORD: 'yourDatabasePassword',
    
    // Other enums and constant values
    STATUS_ACTIVE: 'active',
    STATUS_INACTIVE: 'inactive',
    ROLE_ADMIN: 'admin',
    ROLE_USER: 'user',
    PACKAGE_PATH : 'server/model/',
    DEFAULT_REFCODE : 'MCLR01'
  };
  
  // Export the config object
  module.exports = Config;