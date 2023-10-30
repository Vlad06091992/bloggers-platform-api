import express, {Response} from "express";
import {RequestWithQuery, RootDBType} from "../../types";
import {postsRepository} from "./posts-repository";
import {QueryPostModel} from "./model/QueryPostModel";
import {PostViewModel} from "./model/PostViewModel";

export const getPostsRouter = (db: RootDBType) => {
    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryPostModel>, res: Response<PostViewModel[]>) => {

        let foundedPosts = postsRepository.findPosts(req.query.title)
        res.status(200).send(foundedPosts)
    })


    return router
}