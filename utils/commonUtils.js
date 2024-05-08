// Function to dynamically import models based on path
async function getModel(filePath) {
    const absolutePath = path.resolve(__dirname, filePath);
    const model = await import(absolutePath);
    return model.default;
}