import {LikesCommentModelClass} from "../../../mongoose/models";
import {ObjectId} from "mongodb";
import {LikesCommentType, LikeStatusType} from "../../../features/likes/likes-comments-types";


export const likesCommentsRepository = {
    async changeLikeStatus(status: LikeStatusType, userId: string, likeId: string) {
        const likeRecord = await LikesCommentModelClass.find({_id: new ObjectId(likeId)})
    },

    async getReactionByComment(commentId: string, userId?: string | null): Promise<{
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatusType
    }> {
        const record = await LikesCommentModelClass.findOne({commentId}).lean()
        const userReaction = userId && await this.findUserReactionByComment(userId, commentId)



        if (record) {
            return {
                likesCount: record.likes.length,
                dislikesCount: record.dislikes.length,
                myStatus: userReaction || "None"
            }
        } else {
            return {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }
        }

    },

    async toggleLikeStatusByUserId(commentId: string, status: LikeStatusType, userId: string) {
        let updateSettings = {}

        if (status === "Like") {
            updateSettings = {
                $push: {likes: {userId}},
                $pull: {dislikes: {userId}},
            }
        }

        if (status === "Dislike") {
            updateSettings = {
                $push: {dislikes: {userId}},
                $pull: {likes: {userId}},
            }
        }

        if (status === "None") {
            updateSettings = {
                $pull: {likes: {userId}, dislikes: {userId}},
            }
        }

        const likeRecord = await LikesCommentModelClass.updateOne({commentId}, updateSettings)
        return likeRecord.modifiedCount === 1
    },

    async findUserReactionByComment(userId: string, commentId: string): Promise<"Like" | "Dislike" | null> {
        const resLikes = await LikesCommentModelClass.findOne({
            commentId: commentId,
            likes: {$elemMatch: {userId: userId}},
        }).lean();

        if (resLikes) return 'Like'

        const resDislikes = await LikesCommentModelClass.findOne({
            commentId: commentId,
            dislikes: {$elemMatch: {userId: userId}}
        }).lean();
        if (resDislikes) return 'Dislike'
        return null
    },

    async updateLikeStatusRecord(recordIdObject: ObjectId, status: LikeStatusType, userId: string) {

        let updateSettings = {}

        if (status === "Like") {
            updateSettings = {
                $push: {likes: {userId}}
            }
        }

        if (status === "Dislike") {
            updateSettings = {
                $push: {dislikes: {userId}}
            }
        }
        const likeRecord = await LikesCommentModelClass.updateOne({_id: recordIdObject}, updateSettings)
        return likeRecord.modifiedCount === 1
    },

    async findLikeRecordById(objectId: ObjectId) {
        return await LikesCommentModelClass.find({_id: objectId})
    },
    async createLikeStatusRecord(record: LikesCommentType) {
        await LikesCommentModelClass.create(record)
    },
    async deleteAllRecords() {
        await LikesCommentModelClass.deleteMany({})
        return true
    }
}