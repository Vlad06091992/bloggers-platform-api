import express, {Response} from "express";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery,
    RequestWithQueryAndParams
} from "../../types";
import {QueryBlogModel} from "./model/request-models/QueryBlogModel";
import {BlogViewModel} from "./model/BlogViewModel";

import {URIParamsBlogIdModel} from "./model/request-models/URIParamsBlogIdModel";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {BlogCreateModel} from "./model/request-models/BlogCreateModel";
import {BlogUpdateModel} from "./model/request-models/BlogUpdateModel";
import {authGuardMiddleware} from "../../middlewares/authGuardMiddleware";
import {validateCreateBlogData} from "./validators/validateCreateBlogData"
import {validateUpdateBlogData} from "./validators/validateUpdateBlogData"
import {blogsRepository} from "./blogs-repository";
import {validateErrors} from "../../middlewares/validateErrors";
import {ResponseBlogsModel} from "./model/response-models/ResponseBlogsModel";
import {findBlogById} from "../blogs/blogs-utils/blogs-utils";
import {isExistingBlog} from "../../middlewares/isExistingBlog";
import {validateCreatePostData} from "../posts/validators/validateCreatePostData";
import {postsRepository} from "../posts/posts-repository";
import {CreatePostModelForSpecificBlog} from "./model/request-models/CreatePostModelForSpecificBlog";
import {QueryPostModel} from "../posts/model/request-models/QueryPostModel";


export const getBlogsRouter = () => {
    const router = express.Router()
    router.get('/', async (req: RequestWithQuery<QueryBlogModel>, res: Response<ResponseBlogsModel>) => {
        const result = await blogsRepository.findBlogs(req.query)
        res.status(HTTP_STATUSES.OK_200).send(result)
    })

    router.post('/', authGuardMiddleware, validateCreateBlogData, validateErrors, async (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel | number>) => {
        let blog = await blogsRepository.createBlog(req.body)
        res.status(HTTP_STATUSES.CREATED_201).send(blog)
    })


    router.get('/:id', async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogViewModel | number>) => {
        const blog = await blogsRepository.getBlogById(req.params.id)
        if (blog) {
            res.send(blog)
        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.put('/:id', authGuardMiddleware, validateUpdateBlogData, validateErrors, async (req: RequestWithParamsAndBody<URIParamsBlogIdModel, BlogUpdateModel>, res: Response<BlogViewModel | any>) => {
        let result = await blogsRepository.updateBlog(req.params.id, req.body)
        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.delete('/:id', authGuardMiddleware, async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response<number>) => {
        const isDeleted = await blogsRepository.deleteBlog(req.params.id)
        if (isDeleted) {
            res.send(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404);
        }
    })


    router.post('/:id/posts', authGuardMiddleware, isExistingBlog, validateCreatePostData, validateErrors, async (req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreatePostModelForSpecificBlog>, res: Response) => {
        let newPost = await postsRepository.createPost({...req.body, blogId: req.params.id})
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)
    })

    router.get('/:id/posts', isExistingBlog, async (req: RequestWithQueryAndParams<URIParamsBlogIdModel, QueryPostModel>, res: Response) => {
        let result = await blogsRepository.findPostsForSpecificBlog(req.query, req.params.id)
        res.status(HTTP_STATUSES.OK_200).send(result)
    })
    return router
}