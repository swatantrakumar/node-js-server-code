// Function to dynamically import models based on path
async function getModel(filePath) {
    const absolutePath = path.resolve(__dirname, filePath);
    const model = await import(absolutePath);
    return model.default;
}
function decodeBase64(encodeData){
    return JSON.parse(Buffer.from(encodeData, 'base64').toString('utf-8'));
}

module.exports = {decodeBase64};