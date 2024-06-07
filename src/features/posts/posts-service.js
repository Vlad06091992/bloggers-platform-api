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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsService = void 0;
const mongodb_1 = require("mongodb");
const posts_repository_1 = require("./posts-repository");
const blogs_service_1 = require("../blogs/blogs-service");
const models_1 = require("../../mongoose/models");
class Post {
    constructor({ blogId, title, blogName, shortDescription, content, }) {
        this.blogId = blogId;
        this._id = new mongodb_1.ObjectId();
        this.blogName = blogName;
        this.title = title;
        this.content = content;
        this.shortDescription = shortDescription;
        this.createdAt = new Date().toISOString();
    }
}
exports.postsService = {
    findPosts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.findPosts(params);
        });
    },
    findPostById(id, result = "boolean") {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield models_1.PostModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
            return result === "boolean" ? !!post : post;
        });
    },
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogName = (yield blogs_service_1.blogsService.findBlogNameByBlogId(body.blogId));
            const newPostTemplate = new Post(Object.assign(Object.assign({}, body), { blogName }));
            return yield posts_repository_1.postsRepository.createPost(newPostTemplate);
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.getPostById(id);
        });
    },
    findPostsForSpecificBlog(reqQuery, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = reqQuery.sortBy || "createdAt";
            const sortDirection = reqQuery.sortDirection || "desc";
            const pageNumber = reqQuery.pageNumber || 1;
            const pageSize = reqQuery.pageSize || 10;
            const totalCount = yield models_1.PostModelClass.countDocuments({ blogId: id });
            //@ts-ignore
            return yield models_1.PostModelClass.pagination({ blogId: id }, pageNumber, pageSize, sortBy, sortDirection, totalCount, this.getPostWithPrefixIdToViewModel);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.deletePost(id);
        });
    },
    getPostWithPrefixIdToViewModel(post) {
        return {
            id: post._id.toString(),
            blogId: post.blogId,
            title: post.title,
            blogName: post.blogName,
            shortDescription: post.shortDescription,
            content: post.content,
            createdAt: post.createdAt,
        };
    },
};
