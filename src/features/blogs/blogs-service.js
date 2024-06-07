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
exports.blogsService = void 0;
const mongodb_1 = require("mongodb");
const blogs_repository_1 = require("./blogs-repository");
const models_1 = require("../../mongoose/models");
class BlogCreateClass {
    constructor({ name, websiteUrl, description }) {
        this._id = new mongodb_1.ObjectId();
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.isMembership = false;
        this.createdAt = new Date().toISOString();
    }
}
exports.blogsService = {
    findBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_1.blogsRepository.findBlogs(query);
        });
    },
    findBlogById(id, result = "boolean") {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield models_1.BlogModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
                return result === "boolean" ? !!blog : blog ? this.getBlogWithPrefixIdToViewModel(blog) : false;
            }
            catch (e) {
                return false;
            }
        });
    },
    findBlogNameByBlogId(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield models_1.BlogModelClass.findOne({ _id: new mongodb_1.ObjectId(blogId) });
            return blog === null || blog === void 0 ? void 0 : blog.name;
        });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlogTemplate = new BlogCreateClass(body);
            return yield blogs_repository_1.blogsRepository.createBlog(newBlogTemplate);
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_1.blogsRepository.updateBlog(id, body);
        });
    },
    getBlogWithPrefixIdToViewModel(blog) {
        return {
            id: blog._id.toString(),
            createdAt: blog.createdAt,
            description: blog.description,
            name: blog.name,
            websiteUrl: blog.websiteUrl,
            isMembership: blog.isMembership,
        };
    }
};
