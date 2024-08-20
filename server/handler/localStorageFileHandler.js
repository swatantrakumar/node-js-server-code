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
                const fullPath = path.join(bucketName, innerBucketPath);
                
                // Write file to local storage
                fs.writeFileSync(fullPath, fileData);
    
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
    
}
module.exports = LocalStorageFileHandler;