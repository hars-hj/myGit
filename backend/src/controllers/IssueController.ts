import { Request, Response } from "express";
import mongoose from "mongoose";
import {Issue} from '../models/issueModel.js'
import {Repository} from '../models/repoModel.js'
import {Types} from 'mongoose';

type params = {id:string};
type updateissue = {
    title?:string,
    description?:string,
    status?:string
}
async function CreateIssue(req: Request,res: Response){

    try{
         const {title,description,status,repository}=req.body;
         const repositoryId = new Types.ObjectId(repository);
     if (!mongoose.Types.ObjectId.isValid(repository)) {
            return res.status(400).json({ message: "Invalid reposetory ID" });
            }

    const newIssue = new Issue({
        title,
        description,
        status,
        repository
    });

    const issue  = await newIssue.save();

    res.status(201).json({message:"issue created successfully",issue});
    } catch(err){
        console.error("error creating issue",err);
        res.status(500).json({message:"server error"});
    }
   
};

async function UpdateIssue(req: Request<params>,res: Response){
    try{
         const {id}=req.params;
         const{title,description,status} = req.body;

         let updateissuelist:updateissue={};
         if(title) updateissuelist.title = title;
         if(description) updateissuelist.description = description;
         if(status) updateissuelist.status = status;


         const issue = await Issue.findByIdAndUpdate({_id:id,updateissuelist});
         res.status(200).json({message:"issue updated successfully",issue});
    } catch(err){
        console.error("error fetching  issue by id",err);
        res.status(500).json({message:"server error"});
    }
};

async function DeleteIssue (req: Request,res: Response){
    try{
         const {id}=req.params;
         const issue = await Issue.findByIdAndDelete({_id:id});
         res.status(200).json({message:"issue deleted successfully"});
    } catch(err){
        console.error("error fetching  issue by id",err);
        res.status(500).json({message:"server error"});
    }
};

async function FetchAllIssue (req: Request,res: Response){
      try{
       
         const issues = await Issue.find({});
         res.status(200).json({issues});
    } catch(err){
        console.error("error fetching all issues",err);
        res.status(500).json({message:"server error"});
    }
};

async function FetchIssue  (req: Request<params>,res: Response){
      try{
         const {id}=req.params;
         const issue = await Issue.find({_id:id});
         res.status(200).json({issue});
    } catch(err){
        console.error("error fetching  issue by id",err);
        res.status(500).json({message:"server error"});
    }
};

export {CreateIssue,UpdateIssue,DeleteIssue,FetchAllIssue,FetchIssue};