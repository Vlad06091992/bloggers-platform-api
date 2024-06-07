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
exports.commentsService = void 0;
const comments_repository_1 = require("../comments/comments-repository");
const models_1 = require("../../mongoose/models");
const mongodb_1 = require("mongodb");
const posts_service_1 = require("../../features/posts/posts-service");
class Comment {
    constructor({ postId, content, commentatorInfo }) {
        this._id = new mongodb_1.ObjectId();
        this.postId = postId;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = new Date().toISOString();
    }
}
exports.commentsService = {
    getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_repository_1.commentsRepository.getCommentById(id);
        });
    },
    mapCommentToViewModel(comment) {
        return {
            commentatorInfo: comment.commentatorInfo,
            content: comment.content,
            createdAt: comment.createdAt,
            id: comment._id.toString(),
        };
    },
    createComment(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new Comment(body);
            return yield comments_repository_1.commentsRepository.createComment(result);
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_repository_1.commentsRepository.deleteComment(id);
        });
    },
    updateComment(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_repository_1.commentsRepository.updateComment(id, body);
        });
    },
    findCommentsForSpecificPost(reqQuery, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = reqQuery.sortBy || "createdAt";
            const sortDirection = reqQuery.sortDirection || "desc";
            const pageNumber = reqQuery.pageNumber || 1;
            const pageSize = reqQuery.pageSize || 10;
            const totalCount = yield models_1.CommentsModelClass.countDocuments({ postId: id });
            //@ts-ignore
            return yield models_1.CommentsModelClass.pagination({ postId: id }, pageNumber, pageSize, sortBy, sortDirection, totalCount, posts_service_1.postsService.getPostWithPrefixIdToViewModel);
        });
    }
};
