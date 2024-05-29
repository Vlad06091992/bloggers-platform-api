import {CommentContent, CommentCreateModel, CommentType, CommentViewModel, QueryCommentModel} from "./types/types";
import {commentsRepository} from "../comments/comments-repository";
import {CommentsModelClass} from "../../mongoose/models";
import {ObjectId, WithId} from "mongodb";
import {postsService} from "../../features/posts/posts-service";
import {likesCommentsService} from "../../features/likes/likes-comments-service";



class Comment {
    _id: ObjectId
    createdAt: string;
    constructor(public postId:string, public content:string, public commentatorInfo:{
        userId: string;
        userLogin: string;
    }) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString();
    }
}


export const commentsService = {
    async getCommentById(id: string, userId?:string) {
        return await commentsRepository.getCommentById(id,userId)
    },

    async mapCommentToViewModel(comment: WithId<CommentType>): Promise<CommentViewModel> {
        const ReactionByComment = await likesCommentsService.getReactionByComment(comment._id.toString(), comment.commentatorInfo.userId)
        return {
            commentatorInfo: comment.commentatorInfo,
            content: comment.content,
            createdAt: comment.createdAt,
            id: comment._id.toString(),
            likesInfo:ReactionByComment
        }
    },

    async createComment(body: CommentCreateModel) {
         const {postId,content,commentatorInfo} = body
        const result = new Comment(postId,content,commentatorInfo)
        return await commentsRepository.createComment(result)
    },

    async deleteComment(id: string) {
        return await commentsRepository.deleteComment(id)
    },

    async updateComment(id: string, body: CommentContent) {
        return await commentsRepository.updateComment(id, body)
    },

    async findCommentsForSpecificPost(reqQuery: QueryCommentModel, id: string, userId?:string) {
        const sortBy = reqQuery.sortBy || "createdAt";
        const sortDirection = reqQuery.sortDirection || "desc";
        const pageNumber = reqQuery.pageNumber || 1;
        const pageSize = reqQuery.pageSize || 10;


        const totalCount = await CommentsModelClass.countDocuments({postId: id});
        //@ts-ignore
        const result = await CommentsModelClass.pagination({postId: id}, pageNumber, pageSize, sortBy, sortDirection, totalCount,this.mapCommentToViewModel)
        return result
    }
}

