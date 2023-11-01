import express, {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../../types";
import {QueryBlogModel} from "./model/QueryBlogModel";
import {BlogViewModel} from "./model/BlogViewModel";
import {blogsRepository} from "./blogs-repository";
import {URIParamsBlogIdModel} from "./model/URIParamsBlogIdModel";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {BlogCreateModel} from "./model/BlogCreateModel";
import {validationResult} from "express-validator"
import {authGuardMiddleware} from "../../middlewares/authGuardMiddleware";
import {validateCreateBlogData} from "./validators/validateCreateBlogData"
import {validateUpdateBlogData} from "./validators/validateUpdateBlogData"

function createErrorResponse(errors: any) {
    return {errorsMessages: errors.map((el: any) => ({message: el.msg, field: el.path}))}
}

export const getBlogsRouter = () => {
    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryBlogModel>, res: Response<BlogViewModel[]>) => {
        let foundedBlogs = blogsRepository.findBlogs(req.query.title)
        res.status(200).send(foundedBlogs)
    })


    router.post('/', authGuardMiddleware, validateCreateBlogData, (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel | any>) => {
        const errors = validationResult(req).array({onlyFirstError:true});
        if (errors.length) {
            res.status(400).send(createErrorResponse(errors))
        }
        let newBlog = blogsRepository.createBlog(req.body)
        res.status(200).send(newBlog)
    })


    router.get('/:id', (req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogViewModel | number>) => {
        const blog = blogsRepository.getBlogById(req.params.id)
        if (blog) {
            res.send(blog)
        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.put('/:blogId', authGuardMiddleware, validateUpdateBlogData, (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel | any>) => {
        const errors = validationResult(req).array({onlyFirstError:true});
        if (errors.length) {
            res.status(400).send(createErrorResponse(errors))
        }
        let newBlog = blogsRepository.createBlog(req.body)
        res.status(204)
        // res.status(200).send(newBlog)
    })


    return router
}