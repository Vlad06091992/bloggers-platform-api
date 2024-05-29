import {ObjectId, WithId} from "mongodb";
import {PostCreateModel, PostType, PostViewModel, QueryPostModel, ResponsePostsModel} from "./types/types";
import {postsRepository} from "./posts-repository";
import {blogsService} from "../../features/blogs/composition-blogs";
import {PostModelClass} from "../../mongoose/models";

type ResultType = "object" | "boolean";

type CreatePostForClass = PostCreateModel & {
    blogName: string;
};

class Post {
    _id: ObjectId;
    createdAt: string;
    constructor(
        public blogId: string,
        public title: string,
        public blogName: string,
        public shortDescription: string,
        public content: string,
    ) {
        this._id = new ObjectId();
        this.createdAt = new Date().toISOString();
    }
}

export const postsService = {

    async findPosts(params: QueryPostModel) {
        return await postsRepository.findPosts(params);
    },


    async findPostById(id: string, result: ResultType = "boolean") {
        const post = await PostModelClass.findOne({_id: new ObjectId(id)});
        return result === "boolean" ? !!post : post;
    },

    async createPost(body: PostCreateModel) {
        const{blogId,shortDescription,content,title} = body
        const blogName = (await blogsService.findBlogNameByBlogId(body.blogId))!;
        const newPostTemplate = new Post(blogId,title,blogName,shortDescription,content)
        return await postsRepository.createPost(newPostTemplate)
    },

    async getPostById(id: string) {
        return await postsRepository.getPostById(id)
    },


    async findPostsForSpecificBlog(reqQuery: QueryPostModel, id: string) {
        const sortBy = reqQuery.sortBy || "createdAt";
        const sortDirection = reqQuery.sortDirection || "desc";
        const pageNumber = reqQuery.pageNumber || 1;
        const pageSize = reqQuery.pageSize || 10;
        const totalCount = await PostModelClass.countDocuments({blogId: id});

        //@ts-ignore
        return await PostModelClass.pagination({blogId: id}, pageNumber, pageSize, sortBy, sortDirection, totalCount, this.getPostWithPrefixIdToViewModel)
    },

    async deletePost(id: string) {
        return await postsRepository.deletePost(id)
    },

    getPostWithPrefixIdToViewModel(post: WithId<PostType>): PostViewModel {
        debugger
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
};

