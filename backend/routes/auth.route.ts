
import express from 'express'
import { Logout, signin, signup } from '../controller/auth.controller';
import { verify } from 'crypto';

export const authRoutes = express.Router();

authRoutes.post('/signup' , signup)


authRoutes.post('/signin' ,signin)


authRoutes.post('/logout' , Logout)

authRoutes.post("/verify-email" , verifyemail);