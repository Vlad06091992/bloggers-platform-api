import mongoose from "mongoose";
import {BlogType} from "../../features/blogs/types/types";
import {PostType} from "../../features/posts/types/types";
import {CommentType} from "../../features/comments/types/types";
import {TokenType} from "../../types";
import {UserSession} from "../../features/userSessions/types";
import {CallToAPI} from "../../features/apiCallHistory/types";
import {pagination} from "../../utils";
import {UserSchema} from "../../domain/users-scheme";


export const BlogSchema = new mongoose.Schema<BlogType>({
    _id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, require: true},
    description: {type: String, require: true},
    websiteUrl: {type: String, require: true},
    isMembership: {type: Boolean, require: true},
    createdAt: {type: String, require: true},
})


export const PostSchema = new mongoose.Schema<PostType>({
    _id: {type: mongoose.Schema.Types.ObjectId},
    title: {type: String, require: true},
    blogId: {type: String, require: true},
    createdAt: {type: String, require: true},
    content: {type: String, require: true},
    shortDescription: {type: String, require: true},
    blogName: {type: String, require: true},
})

export const CommentSchema = new mongoose.Schema<CommentType>({
    _id: {type: mongoose.Schema.Types.ObjectId},
    postId: {type: String, require: true},
    createdAt: {type: String, require: true},
    content: {type: String, require: true},
    commentatorInfo: {
        userId: {type: String, require: true},
        userLogin: {type: String, require: true},
    }
})








export const TokensBlacklistSchema = new mongoose.Schema<TokenType>({
    _id: {type: mongoose.Schema.Types.ObjectId},
    token: {type: String, require: true},
})

export const UserSessionSchema = new mongoose.Schema<UserSession>({
    _id: {type: mongoose.Schema.Types.ObjectId},
    ip: {type: String, require: true},
    userId: {type: String, require: true},
    title: {type: String, require: true},
    deviceId: {type: String, require: true},
    expRefreshToken: {type: String, require: true},
    iatRefreshToken: {type: String, require: true},
    lastActiveDate: {type: String, require: true},
})

export const APICallHistorySchema = new mongoose.Schema<CallToAPI>({
    IP: {type: String, require: true},
    URL: {type: String, require: true},
    date: {type: String, require: true},
    dateToNumber: {type: Number, require: true},

});

// @ts-ignore
BlogSchema.statics.pagination = pagination
PostSchema.statics.pagination = pagination
UserSchema.statics.pagination = pagination
CommentSchema.statics.pagination = pagination