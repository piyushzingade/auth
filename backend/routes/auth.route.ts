
import express from 'express'
import { logout, signin, signup, verifyEmail } from '../controller/auth.controller';


export const authRoutes = express.Router();

authRoutes.post('/signup' , signup)


authRoutes.post('/signin' ,signin)


// authRoutes.post('/logout' , logout)


authRoutes.post("/verify-email" , verifyEmail);