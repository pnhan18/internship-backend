const crypto = require("crypto");
const {s3, GetObjectCommand} = require('../config/s3.config');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const randomName = () => crypto.randomBytes(16).toString("hex");

const generateSignedUrl = async (fileName, expiresIn) => {
    const signedUrl = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
    });
    const url = await getSignedUrl(s3, signedUrl, {
        expiresIn: expiresIn ? parseInt(expiresIn, 10) : undefined,
    });
    return url;
};

module.exports = {
    randomName,
    generateSignedUrl,
};