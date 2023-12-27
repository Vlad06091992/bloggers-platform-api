import express, { Request, Response } from "express";
// import bodyParser from "body-parser";
import { db } from "./db";
import { getVideosRouter } from "./features/videos/videos.router";
import { getPostsRouter } from "./features/posts/posts.router";
import { getBlogsRouter } from "./features/blogs/blogs.router";
import { blogsRepository } from "./features/blogs/blogs-repository";
import { postsRepository } from "./features/posts/posts-repository";

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");

export const app = express();

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.4/swagger-ui.css";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bloggers platform REST API",
      version: "1.0.0",
    },
  },
  servers: [
    {
      url: "https://nodejs-swagger-api.vercel.app/",
      description: "My API Documentation",
    },
  ],
  apis: ["./**/*.js", "./**/*.ts", "src/**/*.js", "dist/**/*.js","./dist/**/*.js","./src/**/*.js"],

};
const swaggerSpec = swaggerJsdoc(options);

export const Routes = {
  default: "/",
  videos: "/videos",
  posts: "/posts",
  blogs: "/blogs",
  testing: "/testing/all-data",
};

app.use(express.static("src"));
app.use("*.css", (req, res, next) => {
  res.set("Content-Type", "text/css");
  next();
});

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customCssUrl: CSS_URL }),
);

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
