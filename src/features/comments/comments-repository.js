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
exports.commentsRepository = void 0;
// import {PostCreateModel, PostViewModel, UserCreateModel} from "./types/types";
const models_1 = require("../../mongoose/models");
const mongodb_1 = require("mongodb");
const comments_service_1 = require("./comments-service");
// import {commentsService} from "./";
// type CreatePostForClass = PostCreateModel & {
//   blogName: string;
// };
exports.commentsRepository = {
    getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield models_1.CommentsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
                return comments_service_1.commentsService.mapCommentToViewModel(res);
            }
            catch (e) {
                return null;
            }
        });
    },
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.CommentsModelClass.create(comment);
            return {
                id: comment._id.toString(),
                createdAt: comment.createdAt,
                commentatorInfo: comment.commentatorInfo,
                content: comment.content
            };
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.CommentsModelClass.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                return result.deletedCount === 1;
            }
            catch (e) {
                return false;
            }
        });
    },
    updateComment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.CommentsModelClass.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: data });
                return result.matchedCount === 1;
            }
            catch (e) {
                return false;
            }
        });
    },
    deleteAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.PostModelClass.deleteMany({});
            return true;
        });
    },
};
