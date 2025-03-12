require("dotenv").config();
const cloudinary = require('../config/cloudinary.config');

class UploadService {
    static async uploadImageFromLocal({ file }) {

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'uploads' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );
            uploadStream.end(file.buffer);
        });
    }
}

module.exports = UploadService;