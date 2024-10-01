import { createBlog,deleteBlog, star_blog, unstar_blog, user_blogs, get_star_blogs } from "../controllers/blog.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const blog_router = Router();

blog_router.route("/create_blog").post(verifyJWT,upload.single('blog_img'),createBlog);
blog_router.route("/delete_blog").post(verifyJWT,deleteBlog);
blog_router.route("/star_blog").post(verifyJWT, star_blog);
blog_router.route("/unstar_blog").post(verifyJWT, unstar_blog);
blog_router.route("/get_star_blogs").get(verifyJWT, get_star_blogs);
blog_router.route("/user_blogs").post( user_blogs);


export default blog_router;