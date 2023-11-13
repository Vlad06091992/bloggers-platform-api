import {PostCreateModel} from "./model/PostCreateModel";
import {PostUpdateModel} from "./model/PostUpdateModel";
import {findBlogNameByBlogId} from "./posts-utils/posts-utils";
import {postsCollection} from "../../db-mongo";

type CreatePostForClass = PostCreateModel & {
    blogName: string
}

class Post {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string

    constructor({blogId, title, blogName, shortDescription, content}: CreatePostForClass) {
        this.id = new Date().getTime().toString()
        this.blogId = blogId
        this.blogName = blogName
        this.title = title
        this.content = content
        this.shortDescription = shortDescription
        this.createdAt = new Date().toISOString()
    }
}

export const postsRepository = {
    async findPosts(title: string | null) {
        let filter = {}
        if (title) {
            filter = {title: {regex: title}}
        }
        return await postsCollection.find(filter, {projection: {_id: 0}}).toArray();
    },
    async getPostById(id: string) {
        const post = await postsCollection.findOne({id}, {projection: {_id: 0}});
        if (post) {
            return post
        }
    },
    async createPost(data: PostCreateModel) {
        const blogName = await findBlogNameByBlogId(data.blogId)
        const newPost = new Post({...data, blogName})
        await postsCollection.insertOne({...newPost})
        return newPost
    },
    async updatePost(id: string, data: PostUpdateModel) {
        debugger
        let result = await postsCollection.updateOne({id}, {$set:data})
        return result.matchedCount === 1
    },
    async deletePost(id: string) {
        let result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    },
    async deleteAllPosts() {
        await postsCollection.deleteMany({})
        return true
    }
}