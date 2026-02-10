// Generate a strong random secret key
// Use process.env.JWT_SECRET or fallback to a default (only for dev/test)
const secretKey = {
    key: process.env.JWT_SECRET || "e0c1dcd27b8a52533b3109e7f20d60dc956620b8d31f082c9dca614e7bdb6bfa"
};

module.exports = secretKey;