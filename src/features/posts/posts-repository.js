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
exports.postsRepository = void 0;
const posts_service_1 = require("../posts/posts-service");
const models_1 = require("../../mongoose/models");
const mongodb_1 = require("mongodb");
exports.postsRepository = {
    findPosts(reqQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = reqQuery.sortBy || "createdAt";
            const sortDirection = reqQuery.sortDirection || "desc";
            const pageNumber = reqQuery.pageNumber || 1;
            const pageSize = reqQuery.pageSize || 10;
            const totalCount = yield models_1.PostModelClass.countDocuments();
            //@ts-ignore
            return yield models_1.PostModelClass.pagination(filter, pageNumber, pageSize, sortBy, sortDirection, totalCount, posts_service_1.postsService.getPostWithPrefixIdToViewModel);
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield models_1.PostModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
                return posts_service_1.postsService.getPostWithPrefixIdToViewModel(res);
            }
            catch (e) {
                return null;
            }
        });
    },
    createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.PostModelClass.create(data);
            return {
                id: data._id.toString(),
                blogId: data.blogId,
                title: data.title,
                blogName: data.blogName,
                shortDescription: data.shortDescription,
                content: data.content,
                createdAt: data.createdAt
            };
        });
    },
    updatePost(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.PostModelClass.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: data });
                return result.matchedCount === 1;
            }
            catch (e) {
                return false;
            }
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.PostModelClass.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                return result.deletedCount === 1;
            }
            catch (e) {
                return false;
            }
        });
    },
    deleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.PostModelClass.deleteMany({});
            return true;
        });
    },
};
