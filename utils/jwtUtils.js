const crypto = require('crypto');

// Generate a strong random secret key
const secretKey = crypto.randomBytes(32).toString('hex');

module.exports = secretKey;