const jwt = require('jsonwebtoken');
const secretKey = require('../utils/jwtUtils');

function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }

    if (token) {
        jwt.verify(token, secretKey.key, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token', error: err.name });
            }
            if (decoded && decoded.type === 'refresh') {
                return res.status(401).json({ message: 'Refresh token cannot be used as an access token' });
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ message: 'Token is required' });
    }
}

module.exports = authenticateJWT;
