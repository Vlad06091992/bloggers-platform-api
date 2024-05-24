import {CommentContent, CommentCreateModel, CommentType, CommentViewModel, QueryCommentModel} from "./types/types";
import {commentsRepository} from "../comments/comments-repository";
import {CommentsModelClass, PostModelClass} from "../../mongoose/models";
import {ObjectId, WithId} from "mongodb";
import {postsService} from "../../features/posts/posts-service";


class Comment {
    _id: ObjectId
    postId: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;

    constructor({postId, content, commentatorInfo}: CommentCreateModel) {
        this._id = new ObjectId()
        this.postId = postId;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = new Date().toISOString();
    }
}


export const commentsService = {
    async getCommentById(id: string) {
        return await commentsRepository.getCommentById(id)
    },

    mapCommentToViewModel(comment: WithId<CommentType>): CommentViewModel {
        return {
            commentatorInfo: comment.commentatorInfo,
            content: comment.content,
            createdAt: comment.createdAt,
            id: comment._id.toString(),

        }
    },

    async createComment(body: CommentCreateModel) {
        const result = new Comment(body)
        return await commentsRepository.createComment(result)
    },

    async deleteComment(id: string) {
        return await commentsRepository.deleteComment(id)
    },

    async updateComment(id: string, body: CommentContent) {
        return await commentsRepository.updateComment(id, body)
    },

    async findCommentsForSpecificPost(reqQuery: QueryCommentModel, id: string) {
        const sortBy = reqQuery.sortBy || "createdAt";
        const sortDirection = reqQuery.sortDirection || "desc";
        const pageNumber = reqQuery.pageNumber || 1;
        const pageSize = reqQuery.pageSize || 10;

        const totalCount = await CommentsModelClass.countDocuments({postId: id});
        //@ts-ignore
        return await CommentsModelClass.pagination({postId: id}, pageNumber, pageSize, sortBy, sortDirection, totalCount, postsService.getPostWithPrefixIdToViewModel)
    }
}

