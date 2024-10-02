import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { add_comment, add_reply } from "../controllers/comment.controller.js";

const comment_router = Router();

comment_router.route("/add_comment").post(verifyJWT, add_comment);
comment_router.route("/add_reply").post(verifyJWT, add_reply);

export default comment_router;