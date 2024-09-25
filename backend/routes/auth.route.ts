
import express from 'express'
import { logout, login, signup, verifyEmail , forgotPassword} from '../controller/auth.controller';


export const authRoutes = express.Router();

authRoutes.post('/signup', signup)
authRoutes.post('/login',login)
authRoutes.post('/logout', logout)
authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/forgot-password", forgotPassword);
