import express from "express";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
} from "../controller/auth.controller";
import { verifyToken } from "../middlewares/verifyToken";

export const authRoutes = express.Router();

authRoutes.get("/check-auth", verifyToken, checkAuth);

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/forgot-password", forgotPassword);

authRoutes.post("/reset-password/:token", resetPassword);

