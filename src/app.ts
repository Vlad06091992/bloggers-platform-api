import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import {db} from "./db";
import {getVideosRouter} from "./features/videos/videos.router";
export const app = express()

const Routes = {
    videos: '/videos'
}

app.use(bodyParser())
app.use(Routes.videos, getVideosRouter(db))