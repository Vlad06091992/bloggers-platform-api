import express, {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import {postsRepository} from "./posts-repository";
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

export const getPostsRouter = () => {
    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryPostModel>, res: Response<PostViewModel[]>) => {
        let foundedPosts = postsRepository.findPosts(req.query.title)
        res.status(200).send(foundedPosts)
    })


    router.post('/', authGuardMiddleware, validateCreatePostData, (req: RequestWithBody<PostCreateModel>, res: Response<PostViewModel | any>) => {
        const errors = validationResult(req).array({onlyFirstError: true});
        if (errors.length) {
            res.status(400).send(createErrorResponse(errors))
        } else {
            let newBlog = postsRepository.createPost(req.body)
            res.status(201).send(newBlog)
        }
    })


    router.get('/:id', (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostViewModel | number>) => {
        const post = postsRepository.getPostById(req.params.id)
        if (post) {
            res.send(post)
        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.put('/:id', authGuardMiddleware, validateUpdatePostData, (req: RequestWithParamsAndBody<URIParamsPostIdModel, PostUpdateModel>, res: Response<PostViewModel | any>) => {
        const isExistsPost = findPostById(req.params.id, "boolean")

        if (!isExistsPost) {
            res.sendStatus(404)
            return
        }
        const errors = validationResult(req).array({onlyFirstError: true});
        if (errors.length) {
            res.status(400).send(createErrorResponse(errors))
            return
        }
        postsRepository.updatePost(req.params.id, req.body)
        res.sendStatus(204)
    })

    router.delete('/:id', authGuardMiddleware, (req: RequestWithParams<URIParamsPostIdModel>, res: Response<number>) => {
        const isDeleted = postsRepository.deletePost(req.params.id)
        isDeleted ? res.send(HTTP_STATUSES.NO_CONTENT_204) : res.send(HTTP_STATUSES.NOT_FOUND_404)
    })

    return router
}