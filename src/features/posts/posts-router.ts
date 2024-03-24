import express, {Response} from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
  RequestWithQueryAndParams,
} from "../../types";

import {
  PostCreateModel,
  PostUpdateModel,
  PostViewModel,
  QueryPostModel,
  ResponsePostsModel,
  URIParamsPostIdModel
} from "./types/types";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {validateCreatePostDataWithIdParams,} from "./validators/validateCreatePostData";
import {postsRepository} from "./posts-repository";
import {validateErrors} from "../../middlewares/validateErrors";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {postsService} from "./posts-service";
import {isExistingPost} from "../../middlewares/isExistingPost";
import {authBearerMiddleware} from "../../middlewares/bearerAuthMiddleware";
import {validateCreateCommentData} from "../comments/validators/validateCreateCommentData";
import {commentsService} from "../comments/comments-service";
import {CommentCreateModel, URIParamsCommentsIdModel} from "../comments/types/types";


export const getPostsRouter = () => {
  const router = express.Router();
  router.get(
    "/",
    async (
      req: RequestWithQuery<QueryPostModel>,
      res: Response<ResponsePostsModel>,
    ) => {
      let foundedPosts:ResponsePostsModel = await postsService.findPosts(req.query);
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


  router.post(
      "/:id/comments",
      authBearerMiddleware,
      isExistingPost,
      validateCreateCommentData,
      validateErrors,
      async (
          req: RequestWithParamsAndBody<
              URIParamsPostIdModel,
              CommentCreateModel
          > | any,
          res: Response,
      ) => {
        console.log(req.user)

          let newComment = await commentsService.createComment({
              postId: req.params.id,
              content: req.body.content,
              commentatorInfo: {userId: req.user.id, userLogin: req.user.login}
          });
          res.status(HTTP_STATUSES.CREATED_201).send(newComment);
      },
  );

  router.get(
      "/:id/comments",
      isExistingPost,
      async (
          req: RequestWithQueryAndParams<URIParamsCommentsIdModel, QueryPostModel>,
          res: Response,
      ) => {
        let result = await commentsService.findCommentsForSpecificPost(req.query,req.params.id)
        res.status(HTTP_STATUSES.OK_200).send(result);
      },
  );


  return router;
};
