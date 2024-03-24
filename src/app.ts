import express, {Request, Response} from "express";
// import bodyParser from "body-parser";
import {db} from "./db";
import {getVideosRouter} from "./features/videos/videos.router";
import {getBlogsRouter} from "./features/blogs/blogs-router";
import {blogsRepository} from "./features/blogs/blogs-repository";
// import {commentsRepository} from "./features/users/users-repository";
import {getPostsRouter} from "./features/posts/posts-router";
import {postsRepository} from "./features/posts/posts-repository";
import {getUsersRouter} from "./features/users/users-router";
import {getAuthRouter} from "./features/auth/auth-router";
import {usersRepository} from "./features/users/users-repository";
import {commentsRepository} from "./features/comments/comments-repository";
import {getCommentsRouter} from "./features/comments/comments-router";
const bodyParser = require("body-parser");

export const app = express();


export const Routes = {
  default: "/",
  videos: "/videos",
  comments: "/comments",
  auth: "/auth",
  users: "/users",
  posts: "/posts",
  blogs: "/blogs",
  testing: "/testing/all-data",
};




app.use(bodyParser());
app.get(Routes.default, (req, res) => {
  res.send("hello, is my blogger platform API");
});
app.use(Routes.videos, getVideosRouter());
app.use(Routes.auth, getAuthRouter());
app.use(Routes.users, getUsersRouter());
app.use(Routes.comments, getCommentsRouter());
app.use(Routes.posts, getPostsRouter());
app.use(Routes.blogs, getBlogsRouter());

app.delete(Routes.testing, async (req: Request, res: Response) => {
  db.videos = [];
  db.posts = [];
  // db.blogs = []
  await blogsRepository.deleteAllBlogs();
  await commentsRepository.deleteAllComments();
  await usersRepository.deleteAllUsers();
  await postsRepository.deleteAllPosts();
  res.sendStatus(204);
});
