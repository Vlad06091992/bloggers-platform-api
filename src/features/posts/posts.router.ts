import express, { Response } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../../types";

import { QueryPostModel } from "./model/request-models/QueryPostModel";
import { PostViewModel } from "./model/PostViewModel";
import { PostCreateModel } from "./model/request-models/PostCreateModel";
import { PostUpdateModel } from "./model/request-models/PostUpdateModel";
import { HTTP_STATUSES } from "../../http_statuses/http_statuses";
import { URIParamsPostIdModel } from "./model/request-models/URIParamsPostIdModel";
import {
  validateCreatePostData,
  validateCreatePostDataWithIdParams,
} from "./validators/validateCreatePostData";
import { validateUpdatePostDataWithParams } from "./validators/validateUpdatePostData";
import { authGuardMiddleware } from "../../middlewares/authGuardMiddleware";
import { postsRepository } from "./posts-repository";
import { validateErrors } from "../../middlewares/validateErrors";
import { ResponsePostsModel } from "./model/response-models/responsePostsModel";


/**
 * @openapi
 * /posts:
 *   get:
 *     summary: Returns all posts
 *     tags:
 *       - Posts
 *     parameters:
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
 *     description: Returns all posts
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           text/plain:
 *             example:
 *               pagesCount: 0
 *               page: 0
 *               pageSize: 0
 *               totalCount: 0
 *               items:
 *                 - id: "string"
 *                   title: "string"
 *                   shortDescription: "string"
 *                   content: "string"
 *                   blogId: "string"
 *                   blogName: "string"
 *                   createdAt: "2023-12-27T16:48:20.678Z"
 *             schema:
 *              $ref: '#/components/schemas/PostsResponseModel'
 */


/**
 * @openapi
 * /posts:
 *   post:
 *     summary: Creates a new post
 *     tags:
 *       - Posts
 *     requestBody:
 *       description: Data for constructing new post entity
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "string"
 *             shortDescription: "string"
 *             content: "string"
 *             blogId: "string"
 *           schema:
 *             $ref: '#/components/schemas/PostCreateModelForPostsEndpoint'
 *     responses:
 *       '201':
 *         description: Returns the newly created post
 *         content:
 *           application/json:
 *             example:
 *               id: "string"
 *               title: "string"
 *               shortDescription: "string"
 *               content: "string"
 *               blogId: "string"
 *               blogName: "string"
 *               createdAt: "2023-12-27T18:15:52.231Z"
 *             schema:
 *               $ref: '#/components/schemas/PostViewModel'
 *       '400':
 *         description: If the inputModel has incorrect values
 *         content:
 *           text/plain:
 *             example:
 *               errorsMessages:
 *                 - message: "string"
 *                   field: "string"
 *             schema:
 *               $ref: '#/components/schemas/APIErrorResult'
 *       '401':
 *         description: Unauthorized
 */


/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     summary: Get details of an existing post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Id of the existing post
 *         schema:
 *           type: string
 *         required: true
 *         example: "string"
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           text/plain:
 *             example:
 *               id: "string"
 *               title: "string"
 *               shortDescription: "string"
 *               content: "string"
 *               blogId: "string"
 *               blogName: "string"
 *               createdAt: "2023-12-27T18:27:37.100Z"
 *             schema:
 *               $ref: '#/components/schemas/PostViewModel'
 *       '404':
 *         description: Not Found
 */

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update an existing post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to be updated
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostUpdateModel'
 *           example:
 *             title: "string"
 *             shortDescription: "string"
 *             content: "string"
 *             blogId: "string"
 *     responses:
 *       '204':
 *         description: No Content
 *       '400':
 *         description: If the inputModel has incorrect values
 *         content:
 *           text/plain:
 *             example:
 *               errorsMessages:
 *                 - message: "string"
 *                   field: "string"
 *             schema:
 *               $ref: '#/components/schemas/APIErrorResult'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not Found
 */



/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete an existing post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post.
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

/**
 * @swagger
 * /testing/all-data:
 *   delete:
 *     summary: Clear database, delete all data from all tables/collections
 *     tags:
 *       - Testing
 *     parameters:
 *       - name: No parameters
 *         in: None
 *         description: No parameters are required for this operation.
 *         required: false
 *     responses:
 *       '204':
 *         description: No Content
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
 *     PostCreateModelForPostsEndpoint:
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
 *         blogId:
 *           type: string
 *       required:
 *         - title
 *         - shortDescription
 *         - content
 *         - blogId
 *       example:
 *         title: "New Post"
 *         shortDescription: "A short description for the new post."
 *         content: "The content of the new post."
 *
 *     PostUpdateModel:
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
 *         blogId:
 *           type: string
 *       required:
 *         - title
 *         - shortDescription
 *         - content
 *         - blogId
 *       example:
 *         title: "New Post"
 *         shortDescription: "A short description for the new post."
 *         content: "The content of the new post."
 *
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
 *       example:
 *         id: "string"
 *         title: "string"
 *         shortDescription: "string"
 *         content: "string"
 *         blogId: "string"
 *         blogName: "string"
 *         createdAt: "2023-12-27T16:48:20.678Z"
 */



export const getPostsRouter = () => {
  const router = express.Router();
  router.get(
    "/",
    async (
      req: RequestWithQuery<QueryPostModel>,
      res: Response<ResponsePostsModel>,
    ) => {
      let foundedPosts = await postsRepository.findPosts(req.query);
      res.status(HTTP_STATUSES.OK_200).send(foundedPosts);
    },
  );

  router.post(
    "/",
    authGuardMiddleware,
    validateCreatePostDataWithIdParams,
    validateErrors,
    async (
      req: RequestWithBody<PostCreateModel>,
      res: Response<PostViewModel>,
    ) => {
      let newPost = await postsRepository.createPost(req.body);
      res.status(HTTP_STATUSES.CREATED_201).send(newPost);
    },
  );

  router.get(
    "/:id",
    async (
      req: RequestWithParams<URIParamsPostIdModel>,
      res: Response<PostViewModel | number>,
    ) => {
      const post = await postsRepository.getPostById(req.params.id);
      if (post) {
        res.send(post);
      } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404);
      }
    },
  );

  router.put(
    "/:id",
    authGuardMiddleware,
    validateCreatePostDataWithIdParams,
    validateErrors,
    async (
      req: RequestWithParamsAndBody<URIParamsPostIdModel, PostUpdateModel>,
      res: Response<PostViewModel | number>,
    ) => {
      const isExistsPost = await postsRepository.getPostById(req.params.id);
      if (!isExistsPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }
      await postsRepository.updatePost(req.params.id, req.body);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },
  );

  router.delete(
    "/:id",
    authGuardMiddleware,
    async (
      req: RequestWithParams<URIParamsPostIdModel>,
      res: Response<number>,
    ) => {
      const isDeleted = await postsRepository.deletePost(req.params.id);
      if (isDeleted) {
        res.send(HTTP_STATUSES.NO_CONTENT_204);
      } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404);
      }
    },
  );
  return router;
};
