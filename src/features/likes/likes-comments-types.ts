import {ObjectId} from "mongodb";

export type LikeStatusType = "None" | "Like" | "Dislike"


export type LikesCommentType = {
    _id:ObjectId;
    commentId: string;
    likes: Array<{userId:string}>
    dislikes: Array<{userId:string}>
}