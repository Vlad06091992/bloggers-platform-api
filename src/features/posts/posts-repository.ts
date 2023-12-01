import {PostCreateModel} from "./model/PostCreateModel";
import {PostUpdateModel} from "./model/PostUpdateModel";
import {findBlogNameByBlogId, getPostWithPrefixIdToViewModel} from "./posts-utils/posts-utils";
import {postsCollection} from "../../db-mongo";
import {ObjectId} from "mongodb";
import {PostViewModel} from "./model/PostViewModel";

type CreatePostForClass = PostCreateModel & {
    blogName: string
}

class Post {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string

    constructor({blogId, title, blogName, shortDescription, content}: CreatePostForClass) {
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
        let res = await postsCollection.find(filter).toArray();
        return res.map(getPostWithPrefixIdToViewModel)
    },
    async getPostById(id: string) {
        try {
            let res = await postsCollection.findOne({_id: new ObjectId(id)});
            return getPostWithPrefixIdToViewModel(res!)
        } catch (e) {
            return null
        }
    },
    async createPost(data: PostCreateModel):Promise<PostViewModel> {
        const blogName = (await findBlogNameByBlogId(data.blogId))!
        const newPostTemplate = new Post({...data, blogName})
            const{insertedId} = await postsCollection.insertOne({...newPostTemplate})
            return (await this.getPostById(insertedId.toString()))!
    },
    async updatePost(id: string, data: PostUpdateModel) {
        try {
            let result = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: data})
            return result.matchedCount === 1
        } catch (e){
            return false
        }

    },
    async deletePost(id: string) {
        try {
            let result = await postsCollection.deleteOne({_id:new ObjectId(id)})
            return result.deletedCount === 1
        } catch (e){
            return false
        }
        },
    async deleteAllPosts() {
        await postsCollection.deleteMany({})
        return true
    }
}