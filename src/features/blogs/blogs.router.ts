import express, {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import {QueryBlogModel} from "./model/QueryBlogModel";
import {BlogViewModel} from "./model/BlogViewModel";

import {URIParamsBlogIdModel} from "./model/URIParamsBlogIdModel";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {BlogCreateModel} from "./model/BlogCreateModel";
import {BlogUpdateModel} from "./model/BlogUpdateModel";
import {validationResult} from "express-validator"
import {authGuardMiddleware} from "../../middlewares/authGuardMiddleware";
import {validateCreateBlogData} from "./validators/validateCreateBlogData"
import {validateUpdateBlogData} from "./validators/validateUpdateBlogData"
import {findBlogById} from "./blogs-utils/blogs-utils";
import {createErrorResponse} from "../../utils";
import {blogsRepository} from "./blogs-repository";


export const getBlogsRouter = () => {
    const router = express.Router()
    router.get('/', async (req: RequestWithQuery<QueryBlogModel>, res: Response<BlogViewModel[]>) => {
        let foundedBlogs = await blogsRepository.findBlogs(req.query.title)
        res.status(200).send(foundedBlogs)
    })


    router.post('/', authGuardMiddleware, validateCreateBlogData, async (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel | any>) => {
        const errors = validationResult(req).array({onlyFirstError: true});
        if (errors.length) {
            res.status(400).send(createErrorResponse(errors))
            return
        }
        let newBlog = await blogsRepository.createBlog(req.body)

        //TODO проверка что отправляем именно блог
        res.status(201).send(newBlog)
    })


    router.get('/:id', async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogViewModel | number>) => {
        const blog = await blogsRepository.getBlogById(req.params.id)
        if (blog) {
            res.send(blog)
        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.put('/:id', authGuardMiddleware, validateUpdateBlogData, async (req: RequestWithParamsAndBody<URIParamsBlogIdModel, BlogUpdateModel>, res: Response<BlogViewModel | any>) => {
        const errors = validationResult(req).array({onlyFirstError: true});
        if (errors.length) {
            res.status(400).send(createErrorResponse(errors))
            return
        }
        let result = await blogsRepository.updateBlog(req.params.id, req.body)
        result ? res.sendStatus(204) : res.sendStatus(404)
    })

    router.delete('/:id', authGuardMiddleware, async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response<number>) => {
        const isDeleted = await blogsRepository.deleteBlog(req.params.id)
        isDeleted ? res.send(HTTP_STATUSES.NO_CONTENT_204) : res.send(HTTP_STATUSES.NOT_FOUND_404)
    })
    return router
}