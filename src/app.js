import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import user_router from './routers/user.router.js';
import blog_router from './routers/blog.router.js';
import comment_router from './routers/comment.router.js';
import like_router from './routers/like.router.js';

const app = express();
const corsOptions = {
    origin: '*', // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  };
  
  app.use(cors(corsOptions));
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());


export default app;

app.use("/api/v1/user",user_router)
app.use("/api/v1/blog",blog_router)
app.use("/api/v1/comment",comment_router)
app.use("/api/v1/like",like_router)