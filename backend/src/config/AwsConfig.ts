import AWS from 'aws-sdk';

AWS.config.update({region:"ap-south-1"});

const S3  = new AWS.S3();
const S3_BUCKET = "mygit-folder-bucket";

export {S3,S3_BUCKET}