import express, { Response } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../../types";

import { QueryPostModel } from "./types/types";
import { PostViewModel } from "./types/types";
import { PostCreateModel } from "./types/types";
import { PostUpdateModel } from "./types/types";
import { HTTP_STATUSES } from "../../http_statuses/http_statuses";
import { URIParamsPostIdModel } from "./types/types";
import {
  validateCreatePostData,
  validateCreatePostDataWithIdParams,
} from "./validators/validateCreatePostData";
import { validateUpdatePostDataWithParams } from "./validators/validateUpdatePostData";
import { postsRepository } from "./posts-repository";
import { validateErrors } from "../../middlewares/validateErrors";
import { ResponsePostsModel } from "./types/types";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {postsService} from "./posts-service";

export const getPostsRouter = () => {
  const router = express.Router();
  router.get(
    "/",
    async (
      req: RequestWithQuery<QueryPostModel>,
      res: Response<ResponsePostsModel>,
    ) => {
      let foundedPosts:ResponsePostsModel = await postsRepository.findPosts(req.query);
      res.status(HTTP_STATUSES.OK_200).send(foundedPosts);
    },
  );

  router.post(
    "/",
    authMiddleware,
    validateCreatePostDataWithIdParams,
    validateErrors,
    async (
      req: RequestWithBody<PostCreateModel>,
      res: Response<PostViewModel>,
    ) => {
      let newPost = await postsService.createPost(req.body);
      res.status(HTTP_STATUSES.CREATED_201).send(newPost);
    },
  );

  router.get(
    "/:id",
    async (
      req: RequestWithParams<URIParamsPostIdModel>,
      res: Response<PostViewModel | number>,
    ) => {
      const post = await postsService.getPostById(req.params.id);
      if (post) {
        res.send(post);
      } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404);
      }
    },
  );

  router.put(
    "/:id",
    authMiddleware,
    validateCreatePostDataWithIdParams,
    validateErrors,
    async (
      req: RequestWithParamsAndBody<URIParamsPostIdModel, PostUpdateModel>,
      res: Response<PostViewModel | number>,
    ) => {
      const isExistsPost = await postsService.getPostById(req.params.id);
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
    authMiddleware,
    async (
      req: RequestWithParams<URIParamsPostIdModel>,
      res: Response<number>,
    ) => {
      const isDeleted = await postsService.deletePost(req.params.id);
      if (isDeleted) {
        res.send(HTTP_STATUSES.NO_CONTENT_204);
      } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404);
      }
    },
  );
  return router;
};
