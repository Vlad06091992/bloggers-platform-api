import express, {Response} from "express";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery,
    RequestWithQueryAndParams,
} from "../../types/types";

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
import {CommentCreateModel, CommentViewModel, URIParamsCommentsIdModel} from "../comments/types/types";
import {checkUserByAccessToken} from "../../middlewares/checkUserByAccessToken";
import {validateUpdateLikePostStatus} from "../likes/infrastructure/validators/validateUpdateLikePostStatus";
import {likesPostsService} from "../likes/application/likes-posts-service";


export const getPostsRouter = () => {
    const router = express.Router();
    router.get(
        "/",
        checkUserByAccessToken,
        async (
            req: RequestWithQuery<QueryPostModel>,
            res: Response<ResponsePostsModel>,
        ) => {
            //@ts-ignore
            const userId = req.userId
            let foundedPosts: ResponsePostsModel = await postsService.findPosts(req.query, userId);
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
        checkUserByAccessToken,
        async (
            req: RequestWithParams<URIParamsPostIdModel>,
            res: Response<PostViewModel | number>,
        ) => {
            //@ts-ignore
            const userId = req.userId
            const post = await postsService.getPostById(req.params.id,userId);

         const extendedLikesInfo = await likesPostsService.getExtendedLikesInfo(req.params.id,userId)

            const response = {...post!, extendedLikesInfo}

            if (post) {
                res.send(response);
            }
            else {
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
            const isExistsPost = await postsService.getPostById(req.params.id,null);
            if (!isExistsPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            await postsRepository.updatePost(req.params.id, req.body);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        },
    );

    router.put(
        "/:postId/like-status",
        authBearerMiddleware,
        validateUpdateLikePostStatus,
        validateErrors,
        async (
            req: RequestWithParamsAndBody<{ postId: string }, { likeStatus: "Like" | "Dislike" | "None" }>,
            res: Response<number>,
        ) => {

            const postId = req.params.postId

            const likeStatus = req.body.likeStatus
            //@ts-ignore
            const userId = req.userId
            const reactionUserByPost = await likesPostsService.findReactionByAuthorIdAndPostId(userId, postId)

            if (reactionUserByPost === "None" && likeStatus !== "None") {
                await likesPostsService.createReaction(userId, postId, likeStatus)
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                return
            }

            if (reactionUserByPost === likeStatus) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                return
            }

            if (reactionUserByPost !== "None" && likeStatus !== reactionUserByPost) {
                if (likeStatus !== "None") {
                    await likesPostsService.changeReaction(userId, postId, likeStatus)

                } else {
                    await likesPostsService.deleteReaction(userId, postId)
                }
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                return

            }
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
        checkUserByAccessToken,
        async (
            req: RequestWithQueryAndParams<URIParamsCommentsIdModel, QueryPostModel>,
            res: Response,
        ) => {
            //@ts-ignore
            const userId = req.userId


            let result = await commentsService.findCommentsForSpecificPost(req.query, req.params.id)


            res.status(HTTP_STATUSES.OK_200).send(result);
        },
    );


    return router;
};
