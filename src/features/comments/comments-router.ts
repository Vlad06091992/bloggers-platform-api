import express, {Response} from "express";
import {RequestWithParams,} from "../../types";
import {validateCreateCommentData} from "../comments/validators/validateCreateCommentData";

import {validateErrors} from "../../middlewares/validateErrors";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {ResponseUsersModel, UserViewModel} from "../users/types/types";
import {commentsService} from "./comments-service";
import {authBearerMiddleware} from "../../middlewares/bearerAuthMiddleware";


export const getCommentsRouter = () => {
  const router = express.Router();
  router.get(
    "/:commentId",
      // authMiddleware,
    async (
      req: RequestWithParams<any>,
      res: Response<ResponseUsersModel>,
    ) => {
      let foundedComment:any = await commentsService.getCommentById(req.params.commentId);
      if(foundedComment){
        res.status(HTTP_STATUSES.OK_200).send(foundedComment);

      } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      }
    },
  );

  router.put(
    "/:commentId",
      authBearerMiddleware,
    validateCreateCommentData,
    validateErrors,
    async (
      // req: RequestWithBody<CommentContent>,
      req: any,
      res: Response<UserViewModel>,
    ) => {


      let commentForUpdate = await commentsService.updateComment(req.params.commentId,{
        content: req.body.content
      });

      let comment = await commentsService.getCommentById(req.params.commentId)

      if(!comment){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }

      if(comment?.commentatorInfo.userId != req.user.id){
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
        return
      }

      if(commentForUpdate){
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

      } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      }

    },
  );


  router.delete(
      "/:commentId",
      authBearerMiddleware,
      async (
          req: any,
          res: Response<number>,
      ) => {
        let comment = await commentsService.getCommentById(req.params.commentId)

        if(!comment){
          res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
        }

        if(comment.commentatorInfo.userId != req.user.id){
          res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
          return
        }


        const isDeleted = await commentsService.deleteComment(req.params.commentId);
        if (isDeleted) {
          res.send(HTTP_STATUSES.NO_CONTENT_204);
        } else {
          res.send(HTTP_STATUSES.NOT_FOUND_404);
        }
      },
  );

  // router.get(
  //   "/:id",
  //   async (
  //     req: RequestWithParams<URIParamsPostIdModel>,
  //     res: Response<UserViewModel | number>,
  //   ) => {
  //     const post = await commentsService.getPostById(req.params.id);
  //     if (post) {
  //       res.send(post);
  //     } else {
  //       res.send(HTTP_STATUSES.NOT_FOUND_404);
  //     }
  //   },
  // );
  //
  // router.put(
  //   "/:id",
  //   authMiddleware,
  //   validateCreatePostDataWithIdParams,
  //   validateErrors,
  //   async (
  //     req: RequestWithParamsAndBody<URIParamsPostIdModel, PostUpdateModel>,
  //     res: Response<PostViewModel | number>,
  //   ) => {
  //     const isExistsPost = await commentsService.getPostById(req.params.id);
  //     if (!isExistsPost) {
  //       res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  //       return;
  //     }
  //     await commentsRepository.updatePost(req.params.id, req.body);
  //     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  //   },
  // );


  return router;
};
