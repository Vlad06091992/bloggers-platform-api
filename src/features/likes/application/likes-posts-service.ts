import {LikesPostModel} from "../api/models/likes-post-model";
import {usersService} from "../../users/users-service";
// import {LikesCommentModelClass} from "src/mongoose/models";

export const likesPostsService = {
    async findReactionByAuthorIdAndPostId(authorId: string, postId: string): Promise<"Like" | "Dislike" | "None"> {

        const result = await LikesPostModel.findOne({postId, authorId});
        if (result) {
            return result.status as "Like" | "Dislike"
        } else {
            return "None"
        }
    },
    async createReaction(authorId: string, postId: string, reaction: "Like" | "Dislike") {
        const result = LikesPostModel.createReaction(authorId, postId, reaction);
        return true
    },
    async changeReaction(authorId: string, postId: string, likeStatus: "Like" | "Dislike") {
        const reaction = await LikesPostModel.findOne({authorId, postId});
        if (reaction) {
            reaction.changeStatus(likeStatus)
            reaction.save()
            return true

        } else {
            return false
        }
    },
    async deleteReaction(authorId: string, postId: string) {
        await LikesPostModel.deleteOne({authorId, postId});
        return true
    },
    async getReactionByComment(postId: string) {

        console.log(postId)

        const likesCount = await LikesPostModel.find({postId}).where('status').equals('Like').countDocuments()
        const dislikesCount = await LikesPostModel.find({postId}).where('status').equals('Dislike').countDocuments()
        return {likesCount, dislikesCount}
    },
    async getExtendedLikesInfo(postId: string, userId: string | null): Promise<{
        likesCount: number,
        dislikesCount: number,
        myStatus: "None" | "Like" | "Dislike"
        newestLikes: Array<{
            addedAt: string,
            userId: string,
            login: string
        }>
    }> {

        const {likesCount, dislikesCount} = await this.getReactionByComment(postId)

        let myStatus: "None" | "Like" | "Dislike"

        userId ?  myStatus = await this.findReactionByAuthorIdAndPostId(userId, postId) : myStatus = "None"

        const newestLikes = await this.getNewestLikes(postId)

        return {
            likesCount,
            dislikesCount,
            myStatus,
            newestLikes
        }
    },
    async getNewestLikes(postId:string): Promise<Array<{
        addedAt: string,
        userId: string,
        login: string
    }>> {
        const result = await LikesPostModel.find({postId,status:"Like"}).sort({createdAt: -1}).limit(3);
        // const result = await LikesPostModel.find({postId,status:"Like"}).limit(3);
        const res = result.map(el => ({addedAt: el.createdAt.toISOString(), userId: el.authorId, login: el.login}))
        return res
    }
    // else {
    //     return {
    //         likesCount: 0,
    //         dislikesCount: 0,
    //         myStatus: 'None'
    //     }
    // }
}