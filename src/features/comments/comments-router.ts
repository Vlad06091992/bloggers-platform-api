import express, {Response} from "express";
import {RequestWithParams, RequestWithParamsAndBody,} from "../../types/types";
import {validateCreateCommentData} from "../comments/validators/validateCreateCommentData";

import {validateErrors} from "../../middlewares/validateErrors";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {UserViewModel} from "../users/types/types";
import {commentsService} from "./comments-service";
import {authBearerMiddleware} from "../../middlewares/bearerAuthMiddleware";
import {validateUpdateLikeStatus} from "./validators/validateUpdateLikeStatus";
import {CommentViewModel} from "./types/types";
import {likesCommentsService} from "../../features/likes/likes-comments-service";
// import {checkUserByAccessToken} from "../../../middlewares/checkUserByAccessToken";
import {checkUserByAccessToken} from "../../middlewares/checkUserByAccessToken";



export const getCommentsRouter = () => {
    const router = express.Router();
    router.get(
        "/:commentId",
        checkUserByAccessToken,
        async (
            req: RequestWithParams<any>,
            res: Response<CommentViewModel>,
        ) => {
            //@ts-ignore
            const userId = req.userId


            const foundedComment: CommentViewModel | null = await commentsService.getCommentById(req.params.commentId);
            const reaction = await likesCommentsService.getReactionByComment(req.params.commentId, userId)
            if (foundedComment) {
                res.status(HTTP_STATUSES.OK_200).send({...foundedComment, likesInfo:reaction});
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


            let commentForUpdate = await commentsService.updateComment(req.params.commentId, {
                content: req.body.content
            });

            let comment = await commentsService.getCommentById(req.params.commentId)

            if (!comment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            if (comment?.commentatorInfo.userId != req.user.id) {
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
                return
            }

            if (commentForUpdate) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            }

        },
    );

    router.put(
        "/:commentId/like-status",
        authBearerMiddleware,
        validateUpdateLikeStatus,
        validateErrors,
        async (
            req: RequestWithParamsAndBody<{ commentId: string }, { likeStatus: "Like" | "Dislike" | "None" }>,
            res: Response<UserViewModel>,
        ) => {

            const commentId = req.params.commentId

            const likeStatus = req.body.likeStatus
            //@ts-ignore
            const userId = req.userId
            const foundedComment: CommentViewModel | null = await commentsService.getCommentById(req.params.commentId, userId);
            if (!foundedComment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }


            const reactionUserByComment = await likesCommentsService.findUserReactionByComment(userId,commentId)

            if((reactionUserByComment && reactionUserByComment === likeStatus) || (!reactionUserByComment && likeStatus === "None")){
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                return
            }

            if(reactionUserByComment && reactionUserByComment !== likeStatus){
                await likesCommentsService.toggleLikeStatusByUserId(commentId,likeStatus,userId)
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                return
            }

            const record = await likesCommentsService.findRecordByCommentId(commentId)


            if(record){
                await likesCommentsService.updateLikeStatusRecord(record._id,likeStatus, userId)

            } else {
                 await likesCommentsService.createLikeStatusRecord(likeStatus, userId, commentId)
            }
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
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

            if (!comment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            if (comment.commentatorInfo.userId != req.user.id) {
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
