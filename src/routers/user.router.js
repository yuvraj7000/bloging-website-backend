import {Router} from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const user_router = Router()

user_router.route("/register").post(upload.single('user_img') ,registerUser)
user_router.route("/login").post(loginUser)
user_router.route("/logout").post(verifyJWT, logoutUser)

export default user_router;