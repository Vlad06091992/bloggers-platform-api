import express, {Response} from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
  RequestWithQueryAndParams,
} from "../../types";
import {QueryBlogModel} from "./types/types";
import {BlogViewModel} from "./types/types";

import {URIParamsBlogIdModel} from "./types/types";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {BlogCreateModel} from "./types/types";
import {BlogUpdateModel} from "./types/types";

import {validateCreateBlogData} from "./validators/validateCreateBlogData";
import {validateUpdateBlogData} from "./validators/validateUpdateBlogData";
import {blogsRepository} from "./blogs-repository";
import {validateErrors} from "../../middlewares/validateErrors";
import {ResponseBlogsModel} from "./types/types";
import {isExistingBlog} from "../../middlewares/isExistingBlog";
import {validateCreatePostData} from "../posts/validators/validateCreatePostData";

import {blogsService} from "./blogs-service";
import {CreatePostModelForSpecificBlog, QueryPostModel} from "../posts/types/types";
import {postsService} from "../posts/posts-service";
import {authMiddleware} from "../../middlewares/authMiddleware";


export const getBlogsRouter = () => {
  const router = express.Router();
  router.get(
    "/",
    async (
      req: RequestWithQuery<QueryBlogModel>,
      res: Response<ResponseBlogsModel>,
    ) => {
      const result:ResponseBlogsModel = await blogsService.findBlogs(req.query);
      res.status(HTTP_STATUSES.OK_200).send(result);
    },
  );

  router.post(
    "/",
    authMiddleware,
    validateCreateBlogData,
    validateErrors,
    async (
      req: RequestWithBody<BlogCreateModel>,
      res: Response<BlogViewModel | number>,
    ) => {
      let blog = await blogsService.createBlog(req.body);
      res.status(HTTP_STATUSES.CREATED_201).send(blog);
    },
  );

  router.get(
    "/:id",
    async (
      req: RequestWithParams<URIParamsBlogIdModel>,
      res: Response<BlogViewModel | number>,
    ) => {
      const blog = await blogsService.findBlogById(req.params.id, "object");
      if (blog && typeof blog === 'object') {
        res.send(blog);
      } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404);
      }
    },
  );

  router.put(
    "/:id",
    authMiddleware,
    validateUpdateBlogData,
    validateErrors,
    async (
      req: RequestWithParamsAndBody<URIParamsBlogIdModel, BlogUpdateModel>,
      res: Response<BlogViewModel | any>,
    ) => {
      let result = await blogsService.updateBlog(req.params.id, req.body);
      if (result) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      }
    },
  );

  router.delete(
    "/:id",
    authMiddleware,
    async (
      req: RequestWithParams<URIParamsBlogIdModel>,
      res: Response<number>,
    ) => {
      const isDeleted = await blogsRepository.deleteBlog(req.params.id);
      if (isDeleted) {
        res.send(HTTP_STATUSES.NO_CONTENT_204);
      } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404);
      }
    },
  );

  router.post(
    "/:id/posts",
    authMiddleware,
    isExistingBlog,
    validateCreatePostData,
    validateErrors,
    async (
      req: RequestWithParamsAndBody<
        URIParamsBlogIdModel,
        CreatePostModelForSpecificBlog
      >,
      res: Response,
    ) => {
      let newPost = await postsService.createPost({
        ...req.body,
        blogId: req.params.id,
      });
      res.status(HTTP_STATUSES.CREATED_201).send(newPost);
    },
  );

  router.get(
    "/:id/posts",
    isExistingBlog,
    async (
      req: RequestWithQueryAndParams<URIParamsBlogIdModel, QueryPostModel>,
      res: Response,
    ) => {
      let result = await postsService.findPostsForSpecificBlog(
        req.query,
        req.params.id,
      );
      res.status(HTTP_STATUSES.OK_200).send(result);
    },
  );
  return router;
};




