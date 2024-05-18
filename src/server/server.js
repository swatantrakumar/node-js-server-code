const express = require('express');
const Config = require('./enum/config');

const app = express();


function loadServer(){
    // Start the server
    app.listen(Config.PORT, () => {
        console.log(`Server is running on http://localhost:${Config.PORT}`);
    });
}

module.exports = loadServer;