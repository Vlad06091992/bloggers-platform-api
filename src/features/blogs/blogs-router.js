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
exports.getBlogsRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_statuses_1 = require("../../http_statuses/http_statuses");
const validateCreateBlogData_1 = require("./validators/validateCreateBlogData");
const validateUpdateBlogData_1 = require("./validators/validateUpdateBlogData");
const blogs_repository_1 = require("./blogs-repository");
const validateErrors_1 = require("../../middlewares/validateErrors");
const isExistingBlog_1 = require("../../middlewares/isExistingBlog");
const validateCreatePostData_1 = require("../posts/validators/validateCreatePostData");
const blogs_service_1 = require("./blogs-service");
const posts_service_1 = require("../posts/posts-service");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const getBlogsRouter = () => {
    const router = express_1.default.Router();
    router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield blogs_service_1.blogsService.findBlogs(req.query);
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(result);
    }));
    router.post("/", authMiddleware_1.authMiddleware, validateCreateBlogData_1.validateCreateBlogData, validateErrors_1.validateErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let blog = yield blogs_service_1.blogsService.createBlog(req.body);
        res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(blog);
    }));
    router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield blogs_service_1.blogsService.findBlogById(req.params.id, "object");
        if (blog && typeof blog === 'object') {
            res.send(blog);
        }
        else {
            res.send(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    }));
    router.put("/:id", authMiddleware_1.authMiddleware, validateUpdateBlogData_1.validateUpdateBlogData, validateErrors_1.validateErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield blogs_service_1.blogsService.updateBlog(req.params.id, req.body);
        if (result) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    }));
    router.delete("/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const isDeleted = yield blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
        if (isDeleted) {
            res.send(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.send(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    }));
    router.post("/:id/posts", authMiddleware_1.authMiddleware, isExistingBlog_1.isExistingBlog, validateCreatePostData_1.validateCreatePostData, validateErrors_1.validateErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let newPost = yield posts_service_1.postsService.createPost(Object.assign(Object.assign({}, req.body), { blogId: req.params.id }));
        res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(newPost);
    }));
    router.get("/:id/posts", isExistingBlog_1.isExistingBlog, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield posts_service_1.postsService.findPostsForSpecificBlog(req.query, req.params.id);
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(result);
    }));
    return router;
};
exports.getBlogsRouter = getBlogsRouter;
