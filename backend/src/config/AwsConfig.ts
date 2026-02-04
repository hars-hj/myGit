import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

AWS.config.update({region:"ap-south-1"});

const S3  = new AWS.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
}

);
const S3_BUCKET = "mygit-folder-storage";

export {S3,S3_BUCKET}