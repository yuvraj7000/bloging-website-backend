import { createBlog, star_blog } from "../controllers/blog.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const blog_router = Router();

blog_router.route("/create_blog").post(verifyJWT,upload.single('blog_img'),createBlog);
blog_router.route("/star_blog").post(verifyJWT, star_blog);


export default blog_router;