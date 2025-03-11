require("dotenv").config();
const {randomName, generateSignedUrl} = require('../utils/index');
const { s3 } = require('../config/s3.config');
const {Upload} = require("@aws-sdk/lib-storage");

class UploadService {
    static async uploadImageFromLocal({ file }) {
        const imageName = randomName();
        const bucketName = process.env.AWS_BUCKET_NAME;
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: bucketName,
                Key: imageName,
                Body: file.buffer,
                ContentType: "image/JPEG",
            },
        });
        await upload.done();

        // export url
        const url = await generateSignedUrl(imageName);
        return {
            imageName,
            url,
        };
    }
}

module.exports = UploadService;