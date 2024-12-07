
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { PassThrough } = require('stream');
const Config = require('../enum/config');

// Configure AWS SDK
const config  = {};
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
config.accessKeyId = AWS_ACCESS_KEY_ID
config.secretAccessKey = AWS_SECRET_ACCESS_KEY
config.region = Config.AWS_CONFIG.region

const s3Client = new S3Client(config);

class AWSHelper{    
    async saveFileToS3(bucketName, ud) {
        try {
            const { fileName, fileData, innerBucketPath, isPublicFile } = ud;
    
            // Create metadata for the object
            const objectMetadata = {
                Metadata: {
                    'FILE_NAME': fileName
                }
            };
    
            // Convert fileData to a stream
            const stream = new PassThrough();
            stream.end(fileData);
    
            // Create the parameters for S3 upload
            const params = {
                Bucket: bucketName,
                Key: innerBucketPath,
                Body: stream,
                Metadata: objectMetadata.Metadata
            };
    
            // If the file is public, set the ACL to public-read
            if (isPublicFile) {
                params.ACL = 'public-read';
            }
    
            // Upload the file to S3
            // const putObjectResult = await s3.putObject(params).promise();
            const putObjectResult = await s3Client.send(new GetObjectCommand(params));
            
            if (isPublicFile) {
                // Generate the URL for the uploaded file
                ud.publicUrl = s3.getSignedUrl('getObject', {
                    Bucket: bucketName,
                    Key: innerBucketPath,
                    // Expires: 3600 // URL expiration time in seconds
                });
            }
    
            return putObjectResult;
        } catch (error) {
            console.error('Error while inserting file:', error.message);
            throw error;
        }
    }
    async getS3Object(bucket, key) {
        return await s3Client.getObject(bucket, key);
    }
    async getS3Object(bucket, key) {
        try {
            const params = {
                Bucket: bucket,
                Key: key,
            };
    
            // Fetch the object from S3 using the S3Client
            const command = new GetObjectCommand(params);
            const s3Object = await s3Client.send(command);
    
            return s3Object;
        } catch (error) {
            console.error('Error fetching S3 object:', error);
            throw error;
        }
    }
    async getObjectBytes(objectContentStream) {
        try {
            // Convert the stream (Body) into a Buffer (byte array)
            const chunks = [];
    
            for await (const chunk of objectContentStream) {
                chunks.push(chunk);
            }
    
            const resultBytes = Buffer.concat(chunks);
    
            return resultBytes;
        } catch (error) {
            console.error('Error converting S3 object stream to bytes:', error);
            throw error;
        }
    }
}
module.exports = AWSHelper;