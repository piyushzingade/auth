import  { Request , Response} from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { generateTokenandSetCookie } from "../utils/generateTokenandSetCookie";
import omit from 'lodash.omit';
import { sendVerficationEmail } from "../mailtrap/emails";



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
        const verficationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verficationToken,
            verficationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        // JWT
        generateTokenandSetCookie(res, user._id.toString());

        await sendVerficationEmail(user.email, verficationToken);


        // Remove password from the response object
        const userResponse = omit(user.toObject(), ['password']);

        res.status(201).json({ message: "User Created Successfully", user: userResponse });
    } catch (error) {
        res.status(400).json({ message: error});
    }
};

export const signin = async (req:Request ,res : Response)=>{
    res.send("Sign in Route")
}

export const Logout = async (req:Request ,res : Response)=>{
    res.send("Logout Route")
}



