import {PostType, PostUpdateModel, PostViewModel, QueryPostModel, ResponsePostsModel} from "./types/types";
import {postsService} from '../posts/posts-service'
import {PostModelClass} from "../../mongoose/models";
import {ObjectId} from "mongodb";


export const postsRepository = {
    async findPosts(reqQuery: QueryPostModel,userId:string): Promise<ResponsePostsModel> {
        const sortBy = reqQuery.sortBy || "createdAt";
        const sortDirection = reqQuery.sortDirection || "desc";
        const pageNumber = reqQuery.pageNumber || 1;
        const pageSize = reqQuery.pageSize || 10;

        const totalCount = await PostModelClass.countDocuments();
        //@ts-ignore
        return await PostModelClass.pagination({}, pageNumber, pageSize, sortBy, sortDirection, totalCount, postsService.getPostWithPrefixIdToViewModel, userId)


    },
    async getPostById(id: string,userId:string | null) {
        try {
            let res = await PostModelClass.findOne({_id: new ObjectId(id)});
            return await postsService.getPostWithPrefixIdToViewModel(res!,userId);
        } catch (e) {
            return null;
        }
    },
    async createPost(data: PostType): Promise<PostViewModel> {
        await PostModelClass.create(data);
        return {
            id: data._id.toString(),
            blogId: data.blogId,
            title: data.title,
            blogName: data.blogName,
            shortDescription: data.shortDescription,
            content: data.content,
            createdAt: data.createdAt,
            extendedLikesInfo:{
                likesCount:0,
                dislikesCount:0,
                newestLikes:[],
                myStatus:"None"
            }
        }
    },
    async updatePost(id: string, data: PostUpdateModel) {
        try {
            let result = await PostModelClass.updateOne(
                {_id: new ObjectId(id)},
                {$set: data},
            );
            return result.matchedCount === 1;
        } catch (e) {
            return false;
        }
    },
    async deletePost(id: string) {
        try {
            let result = await PostModelClass.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (e) {
            return false;
        }
    },
    async deleteAllPosts() {
        await PostModelClass.deleteMany({});
        return true;
    },
};
