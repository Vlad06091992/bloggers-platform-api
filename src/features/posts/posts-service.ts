
import {ObjectId, WithId} from "mongodb";
import {PostCreateModel, PostType, PostViewModel, QueryPostModel, ResponsePostsModel} from "./types/types";
import {postsRepository} from "./posts-repository";
import {postsCollection} from "../../db-mongo";
import {blogsService} from "../blogs/blogs-service";

type ResultType = "object" | "boolean";

type CreatePostForClass = PostCreateModel & {
    blogName: string;
};

class Post {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;

    constructor({
                    blogId,
                    title,
                    blogName,
                    shortDescription,
                    content,
                }: CreatePostForClass) {
        this.blogId = blogId;
        this.blogName = blogName;
        this.title = title;
        this.content = content;
        this.shortDescription = shortDescription;
        this.createdAt = new Date().toISOString();
    }
}

export const postsService = {

    async findPosts (params:QueryPostModel){
        return  await postsRepository.findPosts(params);
    },


    async findPostById(id: string, result: ResultType = "boolean") {
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });
        return result === "boolean" ? !!post : post;
    },

    async createPost(body:PostCreateModel){
        const blogName = (await blogsService.findBlogNameByBlogId(body.blogId))!;
        const newPostTemplate = new Post({ ...body, blogName })
        return await postsRepository.createPost(newPostTemplate)
    },

    async getPostById(id:string){
        return await postsRepository.getPostById(id)
    },


    async findPostsForSpecificBlog(reqQuery: QueryPostModel, id: string) {
        const sortBy = reqQuery.sortBy || "createdAt";
        const sortDirection = reqQuery.sortDirection || "desc";
        const pageNumber = reqQuery.pageNumber || 1;
        const pageSize = reqQuery.pageSize || 10;

        const totalCount = await postsCollection.countDocuments({ blogId: id });
        let res = await postsCollection
            .find({ blogId: id })
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ [sortBy]: sortDirection == "asc" ? 1 : -1 })
            .toArray();
        return {
            pagesCount: Math.ceil(+totalCount / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: res.map(this.getPostWithPrefixIdToViewModel),
        };
    },

    async deletePost(id:string){
        return await postsRepository.deletePost(id)
},

    getPostWithPrefixIdToViewModel(post: WithId<PostType>): PostViewModel {
        return {
            id: post._id.toString(),
            blogId: post.blogId,
            title: post.title,
            blogName: post.blogName,
            shortDescription: post.shortDescription,
            content: post.content,
            createdAt: post.createdAt,
        };
    },



    // findIndexPostById(id: string) {
    //     const postId = db.posts.findIndex((post: PostViewModel) => post.id === id);
    //     return postId;
    // }
};

