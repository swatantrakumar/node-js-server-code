// Enum for various constant values in your project
const user = encodeURIComponent(process.env.DB_USER);
const pass = encodeURIComponent(process.env.DB_PASSWORD);
const Config = {
  // MongoDB connection settings
  // MONGODB_URI: `mongodb://${user}:${pass}` + `@127.0.0.1:27017`,
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DATABASE_NAME: process.env.DATABASE_NAME || 'central-elabs-prod',
  MONGODB_URI: `mongodb+srv://${user}:${pass}@cluster0.mkite.mongodb.net`, 
  COLLECTION_NAME: process.env.COLLECTION_NAME || 'yourCollectionName',

  // Other configuration values
  PORT: process.env.PORT || 8080,

  // User credentials (note: sensitive data like passwords should be handled carefully)
  DB_USER: process.env.DB_USER || 'admin',
  DB_PASSWORD: process.env.DB_PASSWORD || 'admin123',

  // Other enums and constant values
  STATUS_ACTIVE: 'active',
  STATUS_INACTIVE: 'inactive',
  ROLE_ADMIN: 'admin',
  ROLE_USER: 'user',
    PACKAGE_PATH : 'server/model/',
    DEFAULT_REFCODE : 'MCLR01',
    STORAGE_ROOT_PATH : 'server',
    AWS : {
      BUCKET_PREFIX : 'prod/appId/refCode/COLLECTION/series/serialId'
  },
  FILE_SYSTEM: 'local',
    AWS_CONFIG : {      
    region: 'ap-south-1'
  },
    AUTH : {
      MODE : 'email',
    SEND_MAIL: true,
      USER:{
      ENABLED: false
    }

  },
    NOTIFIER_DB:'central_notifier',
    EMAIL : {
      BATCH : {
        SIZE : 20
    }
  }
};

// Export the config object
module.exports = Config;