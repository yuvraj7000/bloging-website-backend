import {Router} from "express";
import { registerUser, loginUser, logoutUser, myProfile, userProfile, editProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const user_router = Router()

user_router.route("/register").post(upload.single('user_img') ,registerUser)
user_router.route("/login").post(loginUser)
user_router.route("/logout").post(verifyJWT, logoutUser)
user_router.route("/myProfile").get(verifyJWT, myProfile)
user_router.route("/editProfile").get(verifyJWT, editProfile)
user_router.route("/userProfile").get( userProfile)

export default user_router;