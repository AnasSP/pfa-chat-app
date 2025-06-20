import { Router } from "express";
import { getUserInfo, login, signup, updateProfile, addProfileImage, deleteProfileImage, logOut } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";


const authRoutes = Router();

const upload = multer({dest : 'uploads/profiles/'});


authRoutes.post("/signup",signup)
authRoutes.post("/login", login);
authRoutes.post("/logout", logOut)


authRoutes.get("/user-info", verifyToken, getUserInfo)
authRoutes.post("/update-profile", verifyToken, updateProfile) 
authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage) 

authRoutes.delete("/delete-profile-image", verifyToken, deleteProfileImage)

export default authRoutes;
