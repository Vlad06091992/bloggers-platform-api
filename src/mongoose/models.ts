import mongoose from "mongoose";
import {BlogType} from "../features/blogs/types/types";
import {
    APICallHistorySchema,
    BlogSchema,
    CommentSchema,
    PostSchema, RecoveryPasswordsCodesSchema,
    TokensBlacklistSchema,
    UserSchema,
    UserSessionSchema
} from "../mongoose/schemas";
import {PostType} from "../features/posts/types/types";
import {CommentType} from "../features/comments/types/types";
import {TokenType} from "../types/types";
import {UserSessionType} from "../features/userSessions/types";
import {CallToAPIType} from "../features/apiCallHistory/types";
import {RecoveryPasswordsCodesType} from "../features/auth/types/types";
import {LikesCommentType} from "../features/likes/likes-comments-types";
import {UserType} from "../features/users/types/types";
import {LikesCommentSchema} from "../features/likes/domain/likes-comments-entities";

export const BlogModelClass = mongoose.model<BlogType>('blogs', BlogSchema)
export const PostModelClass = mongoose.model<PostType>("posts",PostSchema);

export const CommentsModelClass = mongoose.model<CommentType>("comments", CommentSchema);
export const UsersModelClass = mongoose.model<UserType>("users", UserSchema);
export const TokensBlacklistModelClass = mongoose.model<TokenType>("tokens", TokensBlacklistSchema);
export const UserSessionModelClass = mongoose.model<UserSessionType>("usersSessions", UserSessionSchema);
export const APICallHistoryModelClass = mongoose.model<CallToAPIType>("APICallHistory",APICallHistorySchema);
export const RecoveryPasswordsCodesModelClass = mongoose.model<RecoveryPasswordsCodesType>("recoveryPasswordsCodes",RecoveryPasswordsCodesSchema);
export const LikesCommentModelClass = mongoose.model<LikesCommentType>("likesComment",LikesCommentSchema);
