import express, {Request, Response} from "express";
// import bodyParser from "body-parser";
import {db} from "./db";
import {getVideosRouter} from "./features/videos/videos.router";
import {getBlogsRouter} from "./features/blogs/blogs-router";
import {blogsRepository} from "./features/blogs/blogs-repository";
// import {usersRepository} from "./features/users/users-repository";
import {getPostsRouter} from "./features/posts/posts-router";
import {postsRepository} from "./features/posts/posts-repository";
const bodyParser = require("body-parser");

export const app = express();


export const Routes = {
  default: "/",
  videos: "/videos",
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
app.use(Routes.posts, getPostsRouter());
app.use(Routes.blogs, getBlogsRouter());

app.delete(Routes.testing, async (req: Request, res: Response) => {
  db.videos = [];
  db.posts = [];
  // db.blogs = []
  await blogsRepository.deleteAllBlogs();
  await postsRepository.deleteAllPosts();
  res.sendStatus(204);
});
