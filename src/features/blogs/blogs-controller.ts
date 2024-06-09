import {BlogsService} from "../../features/blogs/blogs-service";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery,
    RequestWithQueryAndParams
} from "../../types/types";
import {
    BlogCreateModel, BlogUpdateModel,
    BlogViewModel,
    QueryBlogModel,
    ResponseBlogsModel,
    URIParamsBlogIdModel
} from "../../features/blogs/types/types";
import {Response} from "express";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {CreatePostModelForSpecificBlog, QueryPostModel} from "../../features/posts/types/types";
import {postsService} from "../../features/posts/posts-service";

export class BlogsController {



    constructor( protected blogsService: BlogsService) {
        this.blogsService = blogsService
    }

    async getBlogs(
        req: RequestWithQuery<QueryBlogModel>,
        res: Response<ResponseBlogsModel>,
    ) {
        const result: ResponseBlogsModel = await this.blogsService.findBlogs(req.query);
        res.status(HTTP_STATUSES.OK_200).send(result);
    }

    async getBlog(
        req: RequestWithParams<URIParamsBlogIdModel>,
        res: Response<BlogViewModel | number>,
    ) {
        const blog = await this.blogsService.findBlogById(req.params.id, "object");
        if (blog && typeof blog === 'object') {
            res.send(blog);
        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async createBlog(
        req: RequestWithBody<BlogCreateModel>,
        res: Response<BlogViewModel | number>,
    ) {
        let blog = await this.blogsService.createBlog(req.body);
        res.status(HTTP_STATUSES.CREATED_201).send(blog);
    }

    async updateBlog(
        req: RequestWithParamsAndBody<URIParamsBlogIdModel, BlogUpdateModel>,
        res: Response<BlogViewModel | any>,
    ) {
        let result = await this.blogsService.updateBlog(req.params.id, req.body);
        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async deleteBlog(
        req: RequestWithParams<URIParamsBlogIdModel>,
        res: Response<number>,
    ) {
        const isDeleted = await this.blogsService.deleteBlog(req.params.id);
        if (isDeleted) {
            res.send(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.send(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async createPostForBlog(req: RequestWithParamsAndBody<
                                URIParamsBlogIdModel,
                                CreatePostModelForSpecificBlog
                            >,
                            res: Response,) {
        const newPost = await postsService.createPost({
            ...req.body,
            blogId: req.params.id,
        });
        res.status(HTTP_STATUSES.CREATED_201).send(newPost);
    }

    async findPostsForSpecificBlog(req: RequestWithQueryAndParams<URIParamsBlogIdModel, QueryPostModel>,
                                   res: Response,) {

        //@ts-ignore
        const userId = req.userId

        let result = await postsService.findPostsForSpecificBlog(
            req.query,
            req.params.id,
            req.userId
        );
        res.status(HTTP_STATUSES.OK_200).send(result);
    }

}