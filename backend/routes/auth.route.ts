
import express from 'express'
import { Logout, signin, signup } from '../controller/auth.controller';

export const authRoutes = express.Router();

authRoutes.post('/signup' , signup)


authRoutes.get('/signin' ,signin)


authRoutes.get('/logout' , Logout)