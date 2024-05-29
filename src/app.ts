import express, {Request, Response} from "express";
import {getBlogsRouter} from "./features/blogs/blogs-router";
import {blogsRepository} from "./features/blogs/composition-blogs";
import {getPostsRouter} from "./features/posts/posts-router";
import {postsRepository} from "./features/posts/posts-repository";
import {getUsersRouter} from "./features/users/users-router";
import {getAuthRouter} from "./features/auth/auth-router";
import {usersRepository} from "./features/users/users-repository";
import {commentsRepository} from "./features/comments/comments-repository";
import {getCommentsRouter} from "./features/comments/comments-router";
import cookieParser from 'cookie-parser'
import {getSecurityDevicesRouter} from "./features/security_devices/security-devaices-router";
import {usersSessionsRepository} from "./features/userSessions/usersSessionsRepository";
import {apiCallHistoryRepository} from "./features/apiCallHistory/api-call-history-repository";
import {authRepository, AuthRepository} from "./features/auth/auth-repository";
import {likesCommentsRepository} from "./features/likes/likes-comments-repository";

const bodyParser = require("body-parser");
var cors = require('cors')


export const app = express();
app.use(cookieParser())
app.set('trust proxy', true)


export const Routes = {
    default: "/",
    videos: "/videos",
    comments: "/comments",
    auth: "/auth",
    users: "/users",
    posts: "/posts",
    blogs: "/blogs",
    testing: "/testing/all-data",
    security: "/security"
};


app.use(bodyParser());

const corsConfig = {
    origin: true,
    credentials: true,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.get(Routes.default, (req, res) => {
    res.send("hello, is my blogger platform API");
});
app.use(Routes.auth, getAuthRouter());
app.use(Routes.users, getUsersRouter());
app.use(Routes.comments, getCommentsRouter());
app.use(Routes.posts, getPostsRouter());
app.use(Routes.blogs, getBlogsRouter());
app.use(Routes.security, getSecurityDevicesRouter());


app.delete(Routes.testing, async (req: Request, res: Response) => {
    await blogsRepository.deleteAllBlogs();
    await commentsRepository.deleteAllComments();
    await usersRepository.deleteAllUsers();
    await postsRepository.deleteAllPosts();
    await authRepository.clearAllBlackList()
    await usersSessionsRepository.deleteAllSessions()
    await apiCallHistoryRepository.deleteAllRecords()
    await likesCommentsRepository.deleteAllRecords()
    res.sendStatus(204);
});
