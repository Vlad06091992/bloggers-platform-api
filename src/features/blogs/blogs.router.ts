import express, {NextFunction, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery, RootDBType} from "../../types";
import {QueryBlogModel} from "./model/QueryBlogModel";
import {BlogViewModel} from "./model/BlogViewModel";
import {blogsRepository} from "./blogs-repository";
import {URIParamsBlogIdModel} from "./model/URIParamsBlogIdModel";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {BlogCreateModel} from "./model/BlogCreateModel";
import {checkSchema, validationResult} from "express-validator"

import basicAuth from "express-basic-auth"

const authGuardMiddleware2 = basicAuth({
    users: {'admin': 'qwerty'}
})

function createErrorResponse(errors: any) {
    return {errorsMessages: errors.map((el: any) => ({message: el.msg, field: el.path}))}
}

let authGuardMiddleware = (req: any, res: Response, next: NextFunction) => {
    if (req.headers.authorization != "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401)
    } else {
        next()
    }
};

const createBlogValidationBody =
    checkSchema({
        name: {
            errorMessage: "The 'name' field is required and must be no more than 15 characters.",
            isLength: {
                options: {min: 1, max: 15}

            }, exists: true
        },
        description: {
            errorMessage: "The 'description' field is required and must be no more than 500 characters.",
            isLength: {
                options: {min: 1, max: 500}
            }, exists: true
        },
        websiteUrl: {
            errorMessage: "The 'websitUrl' field is required and must be no more than 100 characters.",
            isLength: {
                options: {min: 1, max: 100}
            }, exists: true,
            matches: {
                options: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
                errorMessage: 'you may only use valid website URLs starting with "https://"'
            },
        }
    }, ['body'])


export const getBlogsRouter = (db: RootDBType) => {
    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryBlogModel>, res: Response<BlogViewModel[]>) => {
        let foundedBlogs = blogsRepository.findBlogs(req.query.title)
        res.status(200).send(foundedBlogs)
    })


    router.post('/', authGuardMiddleware, createBlogValidationBody, (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel | any>) => {

        const errors = validationResult(req).array({onlyFirstError:true});
        if (errors) {
            res.send(createErrorResponse(errors))
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
    return router
}