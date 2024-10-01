import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.route("/register").post(upload.single('user_img') ,registerUser)
// router.route("/login").post(loginUser)
// router.route("/logout").post(verifyJWT, logoutUser)
export default router;