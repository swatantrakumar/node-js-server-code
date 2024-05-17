const path = require('path');
const { pathToFileURL } = require('url');

// Function to dynamically import models based on path
async function getModel(filePath) {
    const projectRoot = process.cwd();
    const absolutePath = path.resolve(projectRoot, filePath);

    // Validate the file path and extension
    if (!absolutePath.endsWith('.js') && !absolutePath.endsWith('.mjs')) {
        throw new Error('The file path must end with .js or .mjs');
    }

    // Convert the absolute path to a file URL
    const fileUrl = pathToFileURL(absolutePath).href;

    const model = await import(fileUrl);
    return model.default;
}
function decodeBase64(encodeData){
    return JSON.parse(Buffer.from(encodeData, 'base64').toString('utf-8'));
}

module.exports = {decodeBase64,getModel};