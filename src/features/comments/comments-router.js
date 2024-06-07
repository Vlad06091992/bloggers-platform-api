"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateCreateCommentData_1 = require("../comments/validators/validateCreateCommentData");
const validateErrors_1 = require("../../middlewares/validateErrors");
const http_statuses_1 = require("../../http_statuses/http_statuses");
const comments_service_1 = require("./comments-service");
const bearerAuthMiddleware_1 = require("../../middlewares/bearerAuthMiddleware");
const getCommentsRouter = () => {
    const router = express_1.default.Router();
    router.get("/:commentId", 
    // authMiddleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let foundedComment = yield comments_service_1.commentsService.getCommentById(req.params.commentId);
        if (foundedComment) {
            res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(foundedComment);
        }
        else {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    }));
    router.put("/:commentId", bearerAuthMiddleware_1.authBearerMiddleware, validateCreateCommentData_1.validateCreateCommentData, validateErrors_1.validateErrors, (
    // req: RequestWithBody<CommentContent>,
    req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let commentForUpdate = yield comments_service_1.commentsService.updateComment(req.params.commentId, {
            content: req.body.content
        });
        let comment = yield comments_service_1.commentsService.getCommentById(req.params.commentId);
        if (!comment) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        if ((comment === null || comment === void 0 ? void 0 : comment.commentatorInfo.userId) != req.user.id) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.FORBIDDEN_403);
            return;
        }
        if (commentForUpdate) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    }));
    router.delete("/:commentId", bearerAuthMiddleware_1.authBearerMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let comment = yield comments_service_1.commentsService.getCommentById(req.params.commentId);
        if (!comment) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        if (comment.commentatorInfo.userId != req.user.id) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.FORBIDDEN_403);
            return;
        }
        const isDeleted = yield comments_service_1.commentsService.deleteComment(req.params.commentId);
        if (isDeleted) {
            res.send(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.send(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    }));
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
exports.getCommentsRouter = getCommentsRouter;
