import express from 'express';
import {CreateReposetory,
    fetchAllReposetory,
    fetchReposetoryById,
    fetchReposetoryByName,
    fetchReposetoryForCurrentUser,
    UpdateReposetoryById,
    DeleteReposetoryById,
    VisibilityToggle
} from '../controllers/RepoController.js'

const repoRouter = express.Router();

repoRouter.post('/create',CreateReposetory);
repoRouter.get('/all',fetchAllReposetory);
repoRouter.get('/:id',fetchReposetoryById);
repoRouter.get('/:name',fetchReposetoryByName);
repoRouter.get('/:userId',fetchReposetoryForCurrentUser);
repoRouter.patch('/toggle/:id',VisibilityToggle);
repoRouter.put('/update/:id',UpdateReposetoryById);
repoRouter.delete('/delete/:id',DeleteReposetoryById);

export default repoRouter;