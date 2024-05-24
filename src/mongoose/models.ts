import mongoose from "mongoose";
import {BlogType} from "../features/blogs/types/types";
import {
    APICallHistorySchema,
    BlogSchema,
    CommentSchema,
    PostSchema,
    TokensBlacklistSchema,
    UserSchema,
    UserSessionSchema
} from "../mongoose/schemas";
import {PostType} from "../features/posts/types/types";
import {CommentType} from "../features/comments/types/types";
import {UserType} from "../features/users/types/types";
import {TokenType} from "../types";
import {UserSession} from "../features/userSessions/types";
import {CallToAPI} from "../features/apiCallHistory/types";

export const BlogModelClass = mongoose.model<BlogType>('blogs', BlogSchema)
export const PostModelClass = mongoose.model<PostType>("posts",PostSchema);

export const CommentsModelClass = mongoose.model<CommentType>("comments", CommentSchema);
export const UsersModelClass = mongoose.model<UserType>("users", UserSchema);
export const TokensBlacklistModelClass = mongoose.model<TokenType>("tokens", TokensBlacklistSchema);
export const UserSessionModelClass = mongoose.model<UserSession>("usersSessions", UserSessionSchema);
export const APICallHistoryModelClass = mongoose.model<CallToAPI>("APICallHistory",APICallHistorySchema);