import mongoose from "mongoose";
import {LikesCommentType} from "../../.././features/likes/likes-comments-types";

export const LikesCommentSchema = new mongoose.Schema<LikesCommentType>({
    _id: {type: mongoose.Schema.Types.ObjectId, require: true},
    commentId: {type: String, require: true},
    likes: [
        {userId: {type: String, require: true}},
    ],
    dislikes: [{
        userId: {type: String, require: true},
    }],
})