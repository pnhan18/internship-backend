const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const S3Config = {
    region: "ap-southeast-2",
    // endpoint: "http://localhost:9000",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || "admin",
        secretAccessKey: process.env.AWS_SECRET_KEY || "password",
    },
    // forcePathStyle: true,
};

const s3 = new S3Client(S3Config);

module.exports = { s3, PutObjectCommand, GetObjectCommand };
