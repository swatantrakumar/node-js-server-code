const authenticateJWT = require("./authenticateJWT");

// authMiddleware.js
module.exports = function(req, res, next) {
    let originalUrl = req.originalUrl;
    let list = originalUrl.split('/');
    let lastIndex = list.length;
    let lastPath = list[lastIndex - 1];
    if (req.is('text/*')) {
      let data = '';

      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', () => {
        req.body = data
        if(lastPath == 'cp'){
          return authenticateJWT(req,res,next);
        }
        next();
      });
    } else {
      next();
    }
};