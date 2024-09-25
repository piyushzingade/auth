import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/user.model";
import { generateTokenandSetCookie } from "../utils/generateTokenandSetCookie";
import omit from 'lodash.omit';
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails";

export const signup = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        // JWT
        generateTokenandSetCookie(res, user._id.toString());

        await sendVerificationEmail(user.email, verificationToken);

        // Remove password from the response object
        const userResponse = omit(user.toObject(), ['password']);

        res.status(201).json({ message: "User Created Successfully", user: userResponse });
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

// export const verifyEmail = async (req: Request, res: Response) => {
//     const { code } = req.body;
//     try {
//         const user = await User.findOne({
//             verificationToken: code,
//             verificationTokenExpiresAt: { $gt: Date.now() }
//         });

//         if (!user) {
//             return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
//         }

//         user.isVerified = true;
//         user.verficationToken = undefined;
//         user.verificationTokenExpiresAt = undefined;
//         await user.save();

//         await sendWelcomeEmail(user.email as string, user.name as string);

//         const userResponse = omit(user.toObject(), ['password']);

//         res.status(200).json({ success: true, message: "Email Verified Successfully", user: userResponse });
//     } catch (error) {
//         res.status(400).json({ message: error });
//     }
// };


export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verficationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({ success: false, message: "Invalid or expired verification code" });
            return; // Ensure the function exits after sending the response
        }

        user.isVerified = true;
        user.verficationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user.toObject(),
                password: undefined,
            },
        });
    } catch (error) {
        console.log("Error in verifyEmail:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            res.status(400).json({ success: false, message: "Invalid inputs" });
            return;
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ success: false, message: "Invalid inputs" });
            return;
        }

        // Generate token and set it in cookies
        generateTokenandSetCookie(res, user._id.toString()); // Convert ObjectId to string

        // Update user's last login
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user.toObject(),
                password: undefined, // Remove password from the response
            },
        });
    } catch (error) {
        console.log("Error in login:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({success : true , message : "Logged out Successfully!!!"})
};


export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
             res.status(400).json({ success: false, message: "User not found" });
             return;
        }

        // Generate reset token and expiration time
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // Convert timestamp to Date

        // Assign the token and expiration to the user
        user.resetPasswordToken = resetToken;
        user.resentPasswordExpiresAt = resetTokenExpiresAt;

        // Send password reset email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        // Save the user with updated token and expiration time
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully",
        });
    } catch (error) {
        console.log("Error in forgotPassword:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resentPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Assign properties since we are sure `user` is not null
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resentPasswordExpiresAt = undefined;

        // Ensure user.email exists before sending email
        if (user.email) {
            await sendResetSuccessEmail(user.email);
        }

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ success: false, message: `Error ${error}` });
    }
};
