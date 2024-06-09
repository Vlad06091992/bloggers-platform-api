import {LikesCommentModelClass} from "../../../mongoose/models";
import {ObjectId} from "mongodb";
import {LikeStatusType} from "../../../features/likes/likes-comments-types";
import {likesCommentsRepository} from "../../../features/likes/infrastructure/likes-comments-repository";



// export type LikeStatusCreateRecord = Omit<LikeStatusType,"None">

class LikeStatusRecord {
    constructor(public userId: string, public likeStatus: LikeStatusType, public commentId: string) {
        this._id = new ObjectId();
        this.commentId = commentId
        this.likes = []
        this.dislikes = []

        if (likeStatus === 'Like') {
            this.likes = [{userId}]
        }

        if (likeStatus === 'Dislike') {
            this.dislikes = [{userId}]
        }

    }

    _id: ObjectId
    likes: Array<{ userId: string }>
    dislikes: Array<{ userId: string }>
}

export const likesCommentsService = {
    async toggleLikeStatusByUserId(commentId:string, status: LikeStatusType, userId: string) {
        const likeRecord = await likesCommentsRepository.toggleLikeStatusByUserId(commentId, status, userId)
    },
    async findLikeRecordById(likeId: string) {
        return await LikesCommentModelClass.find({_id: new ObjectId(likeId)})
    },

    async getReactionByComment(commentId:string, userId?:string | null): Promise<{likesCount: number, dislikesCount: number, myStatus: LikeStatusType}>{
        return await likesCommentsRepository.getReactionByComment(commentId,userId)
    },

    async updateLikeStatusRecord(recordIdObject: ObjectId, status: LikeStatusType, userId: string) {
        const record = await likesCommentsRepository.updateLikeStatusRecord(recordIdObject, status, userId)
    },
    async createLikeStatusRecord(status: LikeStatusType, userId: string, postId: string) {
        const record = new LikeStatusRecord(userId, status, postId)
        await likesCommentsRepository.createLikeStatusRecord(record)
    },
    async findUserReactionByComment(userId: string, commentId: string) {
        return  await likesCommentsRepository.findUserReactionByComment(userId, commentId)
    },

    async findRecordByCommentId(commentId: string) {
        return await LikesCommentModelClass.findOne({commentId}).lean()
    },
}