import express from 'express';
import {Signup,Login} from '../controllers/AuthController.js'
import { sign } from 'node:crypto';

const authRouter = express.Router();

authRouter.put('/login',Login);
authRouter.put('/signup',Signup);

export default authRouter;