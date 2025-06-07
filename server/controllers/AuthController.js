import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync } from "fs"



const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days in millieseconds

const createToken = (email,userId) => {
    return jwt.sign({ email,userId }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
}

export const signup = async (req, res, next) => {
    try {
        const {email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({message : "All fields are required"});
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
            user: {  // Add user wrapper for consistent structure
                _id: newUser._id,
                email: newUser.email,
                profileSetup: newUser.profileSetup,
            },
        });
    } catch (error) {
        console.log("Error in signup controller:", error)
        return res.status(500).json( "Internal server error signupController: " + error.message);
    }
}


export const login = async (req, res, next) => {
    try {
        const {email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({message:"All fields are required"});
        }

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.cookie("jwt", createToken(email, user._id), {
            maxAge: maxAge,
            secure: true,
            sameSite: "none",
        });

        return res.status(200).json({ 
            message: "User logged in successfully",
            user: {  // Add user wrapper for consistent structure
                _id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        });
    } catch (error) {
        console.log("Error in login controller:", error)
        return res.status(500).json( "Internal server error loginController: " + error.message);
    }
}

export const getUserInfo = async (req, res, next) => {
    try {

        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        

        return res.status(200).json({ 
            message: "User logged in successfully",
                _id: userData._id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color,
        }); 


    } catch (error) {
        console.log("Error in getUserInfo controller:", error)
        return res.status(500).json( "Internal server error getUserInfoController: " + error.message);
    }
}



export const updateProfile = async (req, res, next) => {
    try {

        const {userId} = req;
        const {firstName, lastName, color} = req.body;
        if (!firstName || !lastName) {
            return res.status(400).json({ message: "Fist name, Last name and colors are required" });
        } 

        const userData = await User.findByIdAndUpdate(userId, {firstName, lastName, color, profileSetup: true},{ new: true, runValidators: true });
        
 
        return res.status(200).json({ 
            message: "User logged in successfully",
                _id: userData._id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color,
        }); 


    } catch (error) {
        console.log("Error in getUserInfo controller:", error)
        return res.status(500).json( "Internal server error getUserInfoController: " + error.message);
    }
}


export const addProfileImage = async (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName);

        const updatedUser = await User.findByIdAndUpdate(
            req.userId, 
            { image: fileName }, 
            { new: true , runValidators: true }
        );
        
 
        return res.status(200).json({ 
            image: updatedUser.image,
        }); 


    } catch (error) {
        console.log("Error in getUserInfo controller:", error)
        return res.status(500).json( "Internal server error getUserInfoController: " + error.message);
    }
}


export const deleteProfileImage = async (req, res, next) => {
    try {

        const {userId} = req;

        const user = await User.findById(userId)

        if(!user){
            return res.status(404).send("User not found")
        }

        if(user.image){
            unlinkSync(user.image)
        }

        user.image=null
        await user.save()
        
        
        return res.status(200).send("Profile image removed successfully ")

    } catch (error) {
        console.log("Error in getUserInfo controller:", error)
        return res.status(500).json( "Internal server error getUserInfoController: " + error.message);
    }
}



export const logOut = async (req, res, next) => {
    try {

        res.cookie("jwt", "", {maxAge:1 , secure:true, sameSite: "None"})
        
        return res.status(200).send("Logged out successfully ")

    } catch (error) {
        console.log("Error in logOut controller:", error)
        return res.status(500).json( "Internal server error logOutController: " + error.message);
    }
}



