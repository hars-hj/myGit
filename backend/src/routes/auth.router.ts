import express from 'express';
import {Signup,Login} from '../controllers/AuthController.js'
import { sign } from 'node:crypto';

const authRouter = express.Router();

authRouter.post('/login',Login);
authRouter.post('/signup',Signup);

export default authRouter;