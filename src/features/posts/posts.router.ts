import express, {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";

import {QueryPostModel} from "./model/QueryPostModel";
import {PostViewModel} from "./model/PostViewModel";
import {PostCreateModel} from "./model/PostCreateModel";
import {PostUpdateModel} from "./model/PostUpdateModel";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {URIParamsPostIdModel} from "./model/URIParamsPostIdModel"
import {validationResult} from "express-validator";
import {validateCreatePostData} from "./validators/validateCreatePostData";
import {validateUpdatePostData} from "./validators/validateUpdatePostData";
import {createErrorResponse} from "../../utils";
import {authGuardMiddleware} from "../../middlewares/authGuardMiddleware";
import {findPostById} from "./posts-utils/posts-utils";
import {postsRepository} from "./posts-repository";

export const getPostsRouter = () => {
    const router = express.Router()
    router.get('/', async (req: RequestWithQuery<QueryPostModel>, res: Response<PostViewModel[]>) => {
        let foundedPosts = await postsRepository.findPosts(req.query.title)
        res.status(200).send(foundedPosts)
    })


    router.post('/', authGuardMiddleware, validateCreatePostData, async (req: RequestWithBody<PostCreateModel>, res: Response<PostViewModel | any>) => {
        const errors = validationResult(req).array({onlyFirstError: true});
        debugger
        if (errors.length) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send(createErrorResponse(errors))
            return
        }
            let newPost = await postsRepository.createPost(req.body)
            res.status(HTTP_STATUSES.CREATED_201).send(newPost)
    })


    router.get('/:id', async (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostViewModel | number>) => {
        const post = await postsRepository.getPostById(req.params.id)
        if (post) {
            res.send(post)
        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.put('/:id', authGuardMiddleware, validateUpdatePostData, async (req: RequestWithParamsAndBody<URIParamsPostIdModel, PostUpdateModel>, res: Response<PostViewModel | any>) => {
        const isExistsPost = await postsRepository.getPostById(req.params.id)

        if (!isExistsPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        const errors = validationResult(req).array({onlyFirstError: true});
        if (errors.length) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send(createErrorResponse(errors))
            return
        }
        await postsRepository.updatePost(req.params.id, req.body)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    router.delete('/:id', authGuardMiddleware, async (req: RequestWithParams<URIParamsPostIdModel>, res: Response<number>) => {
        const isDeleted =await postsRepository.deletePost(req.params.id)
        isDeleted ? res.send(HTTP_STATUSES.NO_CONTENT_204) : res.send(HTTP_STATUSES.NOT_FOUND_404)
    })

    return router
}