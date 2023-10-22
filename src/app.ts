import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import {db} from "./db";
import {getVideosRouter} from "./features/videos/videos.router";
export const app = express()

const Routes = {
    default:'/',
    videos: '/videos'
}

app.use(bodyParser())
app.get(Routes.default,(req,res)=>{
    res.send("hello, is my blogger platform API")
})
app.use(Routes.videos, getVideosRouter(db))