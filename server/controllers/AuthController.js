import { sign } from "jsonwebtoken";
import User from "../models/UserModel";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days in millieseconds

const createToken = (email,userId) => {
    return sign({ email,userId }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
}

export const signup = async (req, res, next) => {
    try {
        const {email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json("All fields are required");
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const newUser = await User.create({
            email,
            password,
        });

        res.cookie("jwt", createToken(email, newUser._id), {
            maxAge: maxAge,
            secure: true,
            sameSite: "none",
        });

        return res.status(201).json({ 
            message: "User created successfully",
            _id: newUser._id,
            email: newUser.email,
            profileSetup: newUser.profileSetup,
        });
    } catch (error) {
        console.log("Error in signup controller:", error)
        return res.status(500).json( "Internal server error: " + error.message);
    }
}