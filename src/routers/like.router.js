import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { add_like, remove_like} from "../controllers/like.controller.js";

const like_router = Router();

like_router.route("/add").post(verifyJWT, add_like);
like_router.route("/remove").post(verifyJWT, remove_like);
export default like_router;