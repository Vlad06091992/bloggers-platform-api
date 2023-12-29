import express, { Response } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
  RequestWithQueryAndParams,
} from "../../types";
import { QueryBlogModel } from "./model/request-models/QueryBlogModel";
import { BlogViewModel } from "./model/BlogViewModel";

import { URIParamsBlogIdModel } from "./model/request-models/URIParamsBlogIdModel";
import { HTTP_STATUSES } from "../../http_statuses/http_statuses";
import { BlogCreateModel } from "./model/request-models/BlogCreateModel";
import { BlogUpdateModel } from "./model/request-models/BlogUpdateModel";
import { authGuardMiddleware } from "../../middlewares/authGuardMiddleware";
import { validateCreateBlogData } from "./validators/validateCreateBlogData";
import { validateUpdateBlogData } from "./validators/validateUpdateBlogData";
import { blogsRepository } from "./blogs-repository";
import { validateErrors } from "../../middlewares/validateErrors";
import { ResponseBlogsModel } from "./model/response-models/ResponseBlogsModel";
import { findBlogById } from "../blogs/blogs-utils/blogs-utils";
import { isExistingBlog } from "../../middlewares/isExistingBlog";
import { validateCreatePostData } from "../posts/validators/validateCreatePostData";
import { postsRepository } from "../posts/posts-repository";
import { CreatePostModelForSpecificBlog } from "./model/request-models/CreatePostModelForSpecificBlog";
import { QueryPostModel } from "../posts/model/request-models/QueryPostModel";

export const getBlogsRouter = () => {
  const router = express.Router();
  router.get(
    "/",
    async (
      req: RequestWithQuery<QueryBlogModel>,
      res: Response<ResponseBlogsModel>,
    ) => {
      const result = await blogsRepository.findBlogs(req.query);
      res.status(HTTP_STATUSES.OK_200).send(result);
    },
  );

  router.post(
    "/",
    authGuardMiddleware,
    validateCreateBlogData,
    validateErrors,
    async (
      req: RequestWithBody<BlogCreateModel>,
      res: Response<BlogViewModel | number>,
    ) => {
      let blog = await blogsRepository.createBlog(req.body);
      res.status(HTTP_STATUSES.CREATED_201).send(blog);
    },
  );

  router.get(
    "/:id",
    async (
      req: RequestWithParams<URIParamsBlogIdModel>,
      res: Response<BlogViewModel | number>,
    ) => {
      const blog = await blogsRepository.getBlogById(req.params.id);
      if (blog) {
        res.send(blog);
      } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404);
      }
    },
  );

  router.put(
    "/:id",
    authGuardMiddleware,
    validateUpdateBlogData,
    validateErrors,
    async (
      req: RequestWithParamsAndBody<URIParamsBlogIdModel, BlogUpdateModel>,
      res: Response<BlogViewModel | any>,
    ) => {
      let result = await blogsRepository.updateBlog(req.params.id, req.body);
      if (result) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      }
    },
  );

  router.delete(
    "/:id",
    authGuardMiddleware,
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
    authGuardMiddleware,
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
      let newPost = await postsRepository.createPost({
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
      let result = await blogsRepository.findPostsForSpecificBlog(
        req.query,
        req.params.id,
      );
      res.status(HTTP_STATUSES.OK_200).send(result);
    },
  );
  return router;
};



/**
 * @openapi
 * /blogs:
 *   get:
 *     summary: Returns blogs with paging
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: query
 *         name: searchNameTerm
 *         description: Search term for blog Name. Name should contain this term in any position.
 *         schema:
 *           type: string
 *           default: null
 *         required: false
 *       - in: query
 *         name: sortBy
 *         description: Field by which sorting occurs.
 *         schema:
 *           type: string
 *           default: createdAt
 *         required: false
 *       - in: query
 *         name: sortDirection
 *         description: Sorting by property.
 *         schema:
 *           type: string
 *           default: asc
 *           enum:
 *             - asc
 *             - desc
 *         required: false
 *       - in: query
 *         name: pageNumber
 *         description: Number of portions that should be returned.
 *         schema:
 *           type: integer
 *           format: int32
 *           default: 1
 *         required: false
 *       - in: query
 *         name: pageSize
 *         description: Portions size that should be returned.
 *         schema:
 *           type: integer
 *           format: int32
 *           default: 10
 *         required: false
 *     description: Get all blogs
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               pagesCount: 1
 *               page: 1
 *               pageSize: 10
 *               totalCount: 1
 *               items:
 *                 - id: "1"
 *                   name: "string"
 *                   description: "string"
 *                   websiteUrl: "string"
 *                   createdAt: "2023-12-27T13:19:29.212Z"
 *             schema:
 *               $ref: '#/components/schemas/BlogsResponseModel'
 */

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     tags:
 *       - Blogs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogCreateModel'
 *           example:
 *             name: "Example Blog"
 *             description: "This is a sample blog."
 *             websiteUrl: "https://example.com"
 *     responses:
 *       '201':
 *         description: Returns the newly created blog
 *         content:
 *           text/plain:
 *             example:
 *               id: "1"
 *               name: "Example Blog"
 *               description: "This is a sample blog."
 *               websiteUrl: "https://example.com"
 *               createdAt: "2023-12-27T13:47:35.066Z"
 *               isMembership: true
 *       '400':
 *         description: If the inputModel has incorrect values
 *         content:
 *           application/json:
 *             example:
 *               errorsMessages:
 *                 - message: "Invalid value"
 *                   field: "fieldName"
 *             schema:
 *              $ref: '#/components/schemas/APIErrorResult'
 *       '401':
 *         description: Unauthorized
 */


/**
 * @swagger
 * /blogs/{blogId}/posts:
 *   get:
 *     summary: Return all posts for a specific blog
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: blogId
 *         description: ID of the blog.
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: pageNumber
 *         description: Number of portions that should be returned.
 *         schema:
 *           type: integer
 *           format: int32
 *         default: 1
 *         example: 1
 *         required: false
 *       - in: query
 *         name: pageSize
 *         description: Portions size that should be returned.
 *         schema:
 *           type: integer
 *           format: int32
 *         default: 10
 *         example: 10
 *         required: false
 *       - in: query
 *         name: sortBy
 *         description: Field by which sorting occurs.
 *         schema:
 *           type: string
 *         default: createdAt
 *         example: createdAt
 *         required: false
 *       - in: query
 *         name: sortDirection
 *         description: Sorting direction.
 *         schema:
 *           type: string
 *         default: desc
 *         example: desc
 *         enum:
 *           - asc
 *           - desc
 *         required: false
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               pagesCount: 1
 *               page: 1
 *               pageSize: 10
 *               totalCount: 1
 *               items:
 *                 - id: "1"
 *                   name: "string"
 *                   description: "string"
 *                   websiteUrl: "string"
 *                   createdAt: "2023-12-27T13:19:29.212Z"
 *             schema:
 *               $ref: '#/components/schemas/PostsResponseModel'
 *       '404':
 *         description: If the specified blog does not exist
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PostsResponseModel:
 *       type: object
 *       properties:
 *         pagesCount:
 *           type: number
 *         page:
 *           type: number
 *         pageSize:
 *           type: number
 *         totalCount:
 *           type: number
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PostViewModel'
 */





/**
 * @swagger
 * /blogs/{blogId}/posts:
 *   post:
 *     summary: Create a new post for a specific blog
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: blogId
 *         description: ID of the blog.
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostCreateModel'
 *           example:
 *             title: "New Post"
 *             shortDescription: "A short description for the new post."
 *             content: "The content of the new post."
 *     responses:
 *       '201':
 *         description: Returns the newly created post
 *         content:
 *           text/plain:
 *             example:
 *               id: "1"
 *               title: "New Post"
 *               shortDescription: "A short description for the new post."
 *               content: "The content of the new post."
 *               blogId: "string"
 *               blogName: "string"
 *               createdAt: "2023-12-27T13:47:35.066Z"
 *             schema:
 *               $ref: '#/components/schemas/PostViewModel'
 *       '400':
 *         description: If the inputModel has incorrect values
 *         content:
 *           application/json:
 *             example:
 *               errorsMessages:
 *                 - message: "Invalid value"
 *                   field: "fieldName"
 *             schema:
 *               $ref: '#/components/schemas/APIErrorResult'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: if specific blog is not exist
 */

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get details of an existing blog
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Existing blog id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           text/plain:
 *             example:
 *               id: "1"
 *               name: "Example Blog"
 *               description: "This is a sample blog."
 *               websiteUrl: "https://example.com"
 *               createdAt: "2023-12-27T16:07:13.504Z"
 *               isMembership: true
 *             schema:
 *               $ref: '#/components/schemas/BlogViewModel'
 *       '404':
 *         description: Not Found
 */


/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update an existing blog
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the blog.
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogUpdateModel'
 *           example:
 *             name: "Updated Blog"
 *             description: "This is an updated blog."
 *             websiteUrl: "https://updated-blog.com"
 *     responses:
 *       '204':
 *         description: No Content
 *       '400':
 *         description: If the inputModel has incorrect values
 *         content:
 *           text/plain:
 *             example:
 *               errorsMessages:
 *                 - message: "Invalid value"
 *                   field: "fieldName"
 *             schema:
 *               $ref: '#/components/schemas/APIErrorResult'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not Found
 */


/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete an existing blog
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the blog.
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '204':
 *         description: No Content
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not Found
 */

//schemas

/**
 * @swagger
 * components:
 *   schemas:
 *     FieldError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         field:
 *           type: string
 *
 *     APIErrorResult:
 *       type: object
 *       properties:
 *         errorsMessages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FieldError'
 *     PostCreateModel:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 15
 *         shortDescription:
 *           type: string
 *           maxLength: 500
 *         content:
 *           type: string
 *           maxLength: 5000
 *       required:
 *         - title
 *         - shortDescription
 *         - content
 *       example:
 *         title: "New Post"
 *         shortDescription: "A short description for the new post."
 *         content: "The content of the new post."
 *     BlogCreateModel:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 15
 *         description:
 *           type: string
 *           maxLength: 500
 *         websiteUrl:
 *           type: string
 *           pattern: '^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'
 *       required:
 *         - name
 *         - description
 *         - websiteUrl
 *       example:
 *         name: "Example Blog"
 *         description: "This is a sample blog."
 *         websiteUrl: "https://example.com"
 *     BlogUpdateModel:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 15
 *         description:
 *           type: string
 *           maxLength: 500
 *         websiteUrl:
 *           type: string
 *           pattern: '^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'
 *       required:
 *         - name
 *         - description
 *         - websiteUrl
 *       example:
 *         name: "Example Blog"
 *         description: "This is a sample blog."
 *         websiteUrl: "https://example.com"
 *     BlogViewModel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         websiteUrl:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         isMembership:
 *           type: boolean
 *           description: True if the user has an active membership subscription to the blog.
 *       required:
 *         - id
 *         - name
 *         - description
 *         - websiteUrl
 *     PostViewModel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         shortDescription:
 *           type: string
 *         content:
 *           type: string
 *         blogId:
 *           type: string
 *         blogName:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     BlogsResponseModel:
 *       type: object
 *       properties:
 *         pagesCount:
 *           type: number
 *         page:
 *           type: number
 *         pageSize:
 *           type: number
 *         totalCount:
 *           type: number
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BlogViewModel'
 */
