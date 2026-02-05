import express from 'express';
import {CreateIssue,UpdateIssue,DeleteIssue,FetchAllIssue,FetchIssue} from '../controllers/IssueController.js'
const issueRouter = express.Router();

issueRouter.post('/create',CreateIssue);
issueRouter.get('/all',FetchAllIssue);
issueRouter.get('/:id',FetchIssue);
issueRouter.put('/update/:id',UpdateIssue);
issueRouter.delete('/delete/:id',DeleteIssue);

export default issueRouter;