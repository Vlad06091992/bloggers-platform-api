import express, {Response} from "express";
import {RequestWithParams, RequestWithQuery, RootDBType} from "../../types";
import {postsRepository} from "./posts-repository";
import {QueryPostModel} from "./model/QueryPostModel";
import {PostViewModel} from "./model/PostViewModel";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {URIParamsPostIdModel} from "./model/URIParamsPostIdModel";

export const getPostsRouter = (db: RootDBType) => {
    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryPostModel>, res: Response<PostViewModel[]>) => {
        let foundedPosts = postsRepository.findPosts(req.query.title)
        res.status(200).send(foundedPosts)
    })


    // router.post('/', (req: RequestWithQuery<QueryPostModel>, res: Response<PostViewModel[]>) => {
    //     let newPost = postsRepository.createPost(req.query.title)
    //     res.status(200).send(newPost)
    // })


    router.get('/:id', (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostViewModel | number>) => {
        const post = postsRepository.getPostById(req.params.id)
        if (post) {
            res.send(post)
        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    return router
}