import express from 'express';
import {GetAllUsers,EditUserProfile,DeleteUserProfile,GetUserProfile} from '../controllers/UserController.js'
const userRouter = express.Router();

userRouter.get('/getallusers',GetAllUsers);
userRouter.put('/edituserprofile',EditUserProfile);
userRouter.delete('/deleteuserprofile',DeleteUserProfile);
userRouter.get('/getuserprofile',GetUserProfile);


export default userRouter;