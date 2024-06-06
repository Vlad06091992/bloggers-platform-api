// import {PostCreateModel, PostViewModel, UserCreateModel} from "./types/types";
import {CommentsModelClass, PostModelClass} from "../../mongoose/models";
import {ObjectId} from "mongodb";
import {CommentType, CommentUpdateModel, CommentViewModel} from "./types/types";
import {commentsService} from "./comments-service";
// import {commentsService} from "./";

// type CreatePostForClass = PostCreateModel & {
//   blogName: string;
// };


export const commentsRepository = {

    async getCommentById(id: string, userId?: string) {
        try {
            const res = await CommentsModelClass.findOne({_id: new ObjectId(id)!})
            if (res) {
                return commentsService.mapCommentToViewModel(res!)
            } else {
                return null
            }
        } catch (e) {
            return null;
        }
    },

    async createComment(comment: CommentType): Promise<CommentViewModel> {
        await CommentsModelClass.create(comment);
        return {
            id: comment._id.toString(),
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            content: comment.content,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
            }
        }
    },

    async deleteComment(id: string) {
        try {
            let result = await CommentsModelClass.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (e) {
            return false;
        }
    },

    async updateComment(id: string, data: CommentUpdateModel) {
        try {
            let result = await CommentsModelClass.updateOne(
                {_id: new ObjectId(id)},
                {$set: data},
            );
            return result.matchedCount === 1;
        } catch (e) {
            return false;
        }
    },

    async deleteAllComments() {
        await PostModelClass.deleteMany({});
        return true;
    },

};
