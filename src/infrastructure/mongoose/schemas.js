"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APICallHistorySchema = exports.UserSessionSchema = exports.TokensBlacklistSchema = exports.UserSchema = exports.CommentSchema = exports.PostSchema = exports.BlogSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../../utils");
const moment_1 = __importDefault(require("moment/moment"));
exports.BlogSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId },
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    isMembership: { type: Boolean, require: true },
    createdAt: { type: String, require: true },
});
exports.PostSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId },
    title: { type: String, require: true },
    blogId: { type: String, require: true },
    createdAt: { type: String, require: true },
    content: { type: String, require: true },
    shortDescription: { type: String, require: true },
    blogName: { type: String, require: true },
});
exports.CommentSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId },
    postId: { type: String, require: true },
    createdAt: { type: String, require: true },
    content: { type: String, require: true },
    commentatorInfo: {
        userId: { type: String, require: true },
        userLogin: { type: String, require: true },
    }
});
exports.UserSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId },
    email: { type: String, require: true },
    password: { type: String, require: true },
    login: { type: String, require: true },
    createdAt: { type: String, require: true },
    registrationData: {
        confirmationCode: { type: String, require: true },
        isConfirmed: { type: Boolean, require: true },
        expirationDate: { type: String, require: true },
    }
});
exports.UserSchema.method('canBeConfirmed', function () {
    debugger;
    const that = this;
    return !that.registrationData.isConfirmed && that.registrationData.expirationDate.toString() > (0, moment_1.default)().toString();
});
exports.TokensBlacklistSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId },
    token: { type: String, require: true },
});
exports.UserSessionSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId },
    ip: { type: String, require: true },
    userId: { type: String, require: true },
    title: { type: String, require: true },
    deviceId: { type: String, require: true },
    expRefreshToken: { type: String, require: true },
    iatRefreshToken: { type: String, require: true },
    lastActiveDate: { type: String, require: true },
});
exports.APICallHistorySchema = new mongoose_1.default.Schema({
    IP: { type: String, require: true },
    URL: { type: String, require: true },
    date: { type: String, require: true },
    dateToNumber: { type: Number, require: true },
});
// @ts-ignore
exports.BlogSchema.statics.pagination = utils_1.pagination;
exports.PostSchema.statics.pagination = utils_1.pagination;
exports.UserSchema.statics.pagination = utils_1.pagination;
exports.CommentSchema.statics.pagination = utils_1.pagination;
