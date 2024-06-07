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
exports.Routes = exports.app = void 0;
const express_1 = __importDefault(require("express"));
// import bodyParser from "body-parser";
const blogs_router_1 = require("./features/blogs/blogs-router");
const blogs_repository_1 = require("./features/blogs/blogs-repository");
// import {commentsRepository} from "./features/users/users-repository";
const posts_router_1 = require("./features/posts/posts-router");
const posts_repository_1 = require("./features/posts/posts-repository");
const users_router_1 = require("./features/users/users-router");
const auth_router_1 = require("./features/auth/auth-router");
const users_repository_1 = require("./features/users/users-repository");
const comments_repository_1 = require("./features/comments/comments-repository");
const comments_router_1 = require("./features/comments/comments-router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const security_devaices_router_1 = require("./features/security_devices/security-devaices-router");
const usersSessionsRepository_1 = require("./features/userSessions/usersSessionsRepository");
const apiCallHistory_repository_1 = require("./features/apiCallHistory/apiCallHistory-repository");
const auth_repository_1 = require("./features/auth/auth-repository");
const bodyParser = require("body-parser");
var cors = require('cors');
exports.app = (0, express_1.default)();
exports.app.use((0, cookie_parser_1.default)());
exports.app.set('trust proxy', true);
exports.Routes = {
    default: "/",
    videos: "/videos",
    comments: "/comments",
    auth: "/auth",
    users: "/users",
    posts: "/posts",
    blogs: "/blogs",
    testing: "/testing/all-data",
    security: "/security"
};
exports.app.use(bodyParser());
const corsConfig = {
    origin: true,
    credentials: true,
};
exports.app.use(cors(corsConfig));
exports.app.options('*', cors(corsConfig));
exports.app.get(exports.Routes.default, (req, res) => {
    res.send("hello, is my blogger platform API");
});
exports.app.use(exports.Routes.auth, (0, auth_router_1.getAuthRouter)());
exports.app.use(exports.Routes.users, (0, users_router_1.getUsersRouter)());
exports.app.use(exports.Routes.comments, (0, comments_router_1.getCommentsRouter)());
exports.app.use(exports.Routes.posts, (0, posts_router_1.getPostsRouter)());
exports.app.use(exports.Routes.blogs, (0, blogs_router_1.getBlogsRouter)());
exports.app.use(exports.Routes.security, (0, security_devaices_router_1.getSecurityDevicesRouter)());
exports.app.delete(exports.Routes.testing, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_repository_1.blogsRepository.deleteAllBlogs();
    yield comments_repository_1.commentsRepository.deleteAllComments();
    yield users_repository_1.usersRepository.deleteAllUsers();
    yield posts_repository_1.postsRepository.deleteAllPosts();
    yield auth_repository_1.AuthRepository.clearAllBlackList();
    yield usersSessionsRepository_1.usersSessionsRepository.deleteAllSessions();
    yield apiCallHistory_repository_1.ApiCallHistoryRepository.deleteAllRecords();
    res.sendStatus(204);
}));
