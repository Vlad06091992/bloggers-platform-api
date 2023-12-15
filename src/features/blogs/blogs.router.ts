import express, {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
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


export const getBlogsRouter = () => {
    const router = express.Router()
    router.get('/', async (req: RequestWithQuery<QueryBlogModel> , res: Response<ResponseBlogsModel>) => {
        const foundedBlogs = await blogsRepository.findBlogs(req.query)

        res.status(HTTP_STATUSES.OK_200).send(foundedBlogs)
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
    return router
}