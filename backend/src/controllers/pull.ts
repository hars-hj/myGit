import { promises as fs } from "fs";
import path from 'path';
import {S3 , S3_BUCKET} from '../config/AwsConfig.js';


const pullRepo = async() =>{
     const repoPath = path.resolve(process.cwd(),'.myGit');
     const commitspath = path.join(repoPath,"commits");

     try{
         const data = await S3.listObjectsV2({
                 Bucket : S3_BUCKET,
                 Prefix: 'commits/'
         }
         ).promise();

         const objects:any = data.Contents;

         for(const object of objects ){
            
            const key = object.Key;
            const fulladd = path.dirname(key);
            const last = fulladd.split("/").pop();
            if (!last) continue;

            const commitDir = path.join(commitspath, last);

            await fs.mkdir(commitDir,{recursive:true});

            const params = {
                 Bucket: S3_BUCKET,
                 Key:key
            }
            const fileContent = await S3.getObject(params).promise();
            const body = fileContent.Body!.toString();
            await fs.writeFile(path.join(repoPath,key),body);

            
         }
         console.log("All commits pulled successfully.");
     }catch(err){
        console.error("Error pulling from S3 bucket: ",err);
     }
}

export {pullRepo};