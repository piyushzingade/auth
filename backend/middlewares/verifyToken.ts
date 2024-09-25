import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include userId and cookies
interface CustomRequest extends Request {
  userId?: string; // Add userId property
  cookies: {
    token?: string; // Ensure token can be optional
  };
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });

  try {
    // Ensure the JWT_SECRET is defined
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const decoded = jwt.verify(token, secret) as { userId: string }; // Cast to the expected type

    if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

    req.userId = decoded.userId; // Assign userId from decoded token
    next();
  } catch (error) {
    console.log("Error in verifyToken ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
