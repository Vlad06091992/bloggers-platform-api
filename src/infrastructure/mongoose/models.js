"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APICallHistoryModelClass = exports.UserSessionModelClass = exports.TokensBlacklistModelClass = exports.UsersModelClass = exports.CommentsModelClass = exports.PostModelClass = exports.BlogModelClass = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schemas_1 = require("./schemas");
exports.BlogModelClass = mongoose_1.default.model('blogs', schemas_1.BlogSchema);
exports.PostModelClass = mongoose_1.default.model("posts", schemas_1.PostSchema);
exports.CommentsModelClass = mongoose_1.default.model("comments", schemas_1.CommentSchema);
exports.UsersModelClass = mongoose_1.default.model("users", schemas_1.UserSchema);
exports.TokensBlacklistModelClass = mongoose_1.default.model("tokens", schemas_1.TokensBlacklistSchema);
exports.UserSessionModelClass = mongoose_1.default.model("usersSessions", schemas_1.UserSessionSchema);
exports.APICallHistoryModelClass = mongoose_1.default.model("APICallHistory", schemas_1.APICallHistorySchema);
