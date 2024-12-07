const fs = require('fs');
const path = require('path');

class LocalStorageFileHandler {
    async saveFileToStorage(bucketName, ud) {
        const result = {};
    
        try {
            const { fileName, fileData, innerBucketPath } = ud;
    
            // Ensure the folder path exists
            const folderPath = path.dirname(innerBucketPath);
            if (await this.createFolderPath(folderPath)) {
                // Create full path to save the file
                const fullPath = path.join(innerBucketPath);
                // Remove the data URL part (if present)
                const base64Data = fileData.replace(/^data:.+;base64,/, '');

                // Convert Base64 to binary and then to a buffer
                const binaryData = Buffer.from(base64Data, 'base64');
                
                // Write file to local storage
                fs.writeFileSync(fullPath, binaryData);
    
                // Optionally, return a success message or file info
                result.success = 'File uploaded successfully';
                result.path = fullPath;
            } else {
                result.error = 'Could not get folder path';
            }
        } catch (error) {
            console.error('Error while inserting file:', error.message);
            result.error = `Error while inserting file: ${error.message}`;
        }
    
        return result;
    }
    async createFolderPath(folderPath) {
        try {
            // Check if the folder exists
            if (!fs.existsSync(folderPath)) {
                // Create the folder recursively if it does not exist
                fs.mkdirSync(folderPath, { recursive: true });
            }
            return true;
        } catch (error) {
            console.error('Error creating folder path:', error.message);
            return false;
        }
    }
    getFileBytes(bucket, key) {
        try {
            // Build the full file path using the bucket and key
            const filePath = path.join(bucket, key);
    
            // Read the file synchronously into a buffer
            const fileContent = fs.readFileSync(filePath);
    
            // Return the file content as a byte array (Buffer in Node.js)
            return fileContent;
        } catch (error) {
            console.error('Error reading file:', error);
            return null; // Return null or throw an error, depending on your use case
        }
    }
    
}
module.exports = LocalStorageFileHandler;