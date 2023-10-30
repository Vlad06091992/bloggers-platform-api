import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import {db} from "./db";
import {getVideosRouter} from "./features/videos/videos.router";
import {getPostsRouter} from "./features/posts/posts.router";
import {getBlogsRouter} from "./features/blogs/blogs.router";

export const app = express()

export const Routes = {
    default: '/',
    videos: '/videos',
    posts: '/posts',
    blogs: '/blogs',
    testing: "/testing/all-data"
}

app.use(bodyParser())
app.get(Routes.default, (req, res) => {
    res.send("hello, is my blogger platform API")
})
app.use(Routes.videos, getVideosRouter(db))
app.use(Routes.posts, getPostsRouter(db))
app.use(Routes.blogs, getBlogsRouter(db))

app.delete(Routes.testing, (req: Request, res: Response) => {
    db.videos = []
    res.sendStatus(204)
})