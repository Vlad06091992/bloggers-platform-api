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
exports.getPostsRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_statuses_1 = require("../../http_statuses/http_statuses");
const validateCreatePostData_1 = require("./validators/validateCreatePostData");
const posts_repository_1 = require("./posts-repository");
const validateErrors_1 = require("../../middlewares/validateErrors");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const posts_service_1 = require("./posts-service");
const isExistingPost_1 = require("../../middlewares/isExistingPost");
const bearerAuthMiddleware_1 = require("../../middlewares/bearerAuthMiddleware");
const validateCreateCommentData_1 = require("../comments/validators/validateCreateCommentData");
const comments_service_1 = require("../comments/comments-service");
const getPostsRouter = () => {
    const router = express_1.default.Router();
    router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let foundedPosts = yield posts_service_1.postsService.findPosts(req.query);
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(foundedPosts);
    }));
    router.post("/", authMiddleware_1.authMiddleware, validateCreatePostData_1.validateCreatePostDataWithIdParams, validateErrors_1.validateErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let newPost = yield posts_service_1.postsService.createPost(req.body);
        res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(newPost);
    }));
    router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield posts_service_1.postsService.getPostById(req.params.id);
        if (post) {
            res.send(post);
        }
        else {
            res.send(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    }));
    router.put("/:id", authMiddleware_1.authMiddleware, validateCreatePostData_1.validateCreatePostDataWithIdParams, validateErrors_1.validateErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const isExistsPost = yield posts_service_1.postsService.getPostById(req.params.id);
        if (!isExistsPost) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        yield posts_repository_1.postsRepository.updatePost(req.params.id, req.body);
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
    }));
    router.delete("/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const isDeleted = yield posts_service_1.postsService.deletePost(req.params.id);
        if (isDeleted) {
            res.send(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.send(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    }));
    router.post("/:id/comments", bearerAuthMiddleware_1.authBearerMiddleware, isExistingPost_1.isExistingPost, validateCreateCommentData_1.validateCreateCommentData, validateErrors_1.validateErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let newComment = yield comments_service_1.commentsService.createComment({
            postId: req.params.id,
            content: req.body.content,
            commentatorInfo: { userId: req.user.id, userLogin: req.user.login }
        });
        res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(newComment);
    }));
    router.get("/:id/comments", isExistingPost_1.isExistingPost, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield comments_service_1.commentsService.findCommentsForSpecificPost(req.query, req.params.id);
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(result);
    }));
    return router;
};
exports.getPostsRouter = getPostsRouter;
