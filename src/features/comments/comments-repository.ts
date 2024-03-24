// import {PostCreateModel, PostViewModel, UserCreateModel} from "./types/types";
import {commentsCollection, postsCollection} from "../../db-mongo";
import {ObjectId} from "mongodb";
import {CommentType, CommentUpdateModel, CommentViewModel} from "./types/types";
import {commentsService} from "./comments-service";
// import {commentsService} from "./";

// type CreatePostForClass = PostCreateModel & {
//   blogName: string;
// };


export const commentsRepository = {

    async getCommentById(id: string) {
        try {
            let res = await commentsCollection.findOne({_id: new ObjectId(id)!})
            debugger
            return commentsService.mapCommentToViewModel(res!)
        } catch (e) {
            return null;
        }
    },

    async createComment(comment: CommentType): Promise<CommentViewModel> {
        const {insertedId} = await commentsCollection.insertOne(comment);
        return (await this.getCommentById(insertedId.toString()))!;
    },

    async deleteComment(id: string) {
        try {
            let result = await commentsCollection.deleteOne({_id: new ObjectId(id)});
            debugger
            return result.deletedCount === 1;
        } catch (e) {
            return false;
        }
    },

    async updateComment(id: string, data: CommentUpdateModel) {
        try {
            let result = await commentsCollection.updateOne(
                {_id: new ObjectId(id)},
                {$set: data},
            );
            debugger
            return result.matchedCount === 1;
        } catch (e) {
            return false;
        }
    },

    async deleteAllComments() {
        await postsCollection.deleteMany({});
        return true;
    },

};
