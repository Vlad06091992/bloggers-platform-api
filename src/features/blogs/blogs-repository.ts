import {blogsCollection} from "../../db-mongo";
import {BlogCreateModel} from "./model/BlogCreateModel";
import {BlogUpdateModel} from "./model/BlogUpdateModel";
import {getBlogWithPrefixIdToViewModel} from "./blogs-utils/blogs-utils";
import {ObjectId} from "mongodb";
import {BlogViewModel} from "./model/BlogViewModel";


class BlogCreateClass {
    name: string
    websiteUrl: string
    description: string
    isMembership: boolean
    createdAt: string

    constructor({name, websiteUrl, description}: BlogCreateModel) {
        this.name = name
        this.description = description
        this.websiteUrl = websiteUrl
        this.isMembership = false
        this.createdAt = new Date().toISOString()
    }
}

export const blogsRepository = {
    async findBlogs(name: string | null) {
        let filter = {}
        if (name) {
            filter = {name: {regex: name}};
        }
        let res = await blogsCollection.find(filter).toArray()
        return res.map(getBlogWithPrefixIdToViewModel)
    },
    async getBlogById(id: string): Promise<BlogViewModel | null> {
        try {
            let res = await blogsCollection.findOne({_id: new ObjectId(id)})
            return getBlogWithPrefixIdToViewModel(res!)
        } catch (e) {
            return null
        }
    },
    async createBlog(data: BlogCreateModel):Promise<BlogViewModel> {
        const newBlogTemplate = new BlogCreateClass(data)
                const {insertedId} = await blogsCollection.insertOne(newBlogTemplate)
                return (await this.getBlogById(insertedId.toString()))!
    },
    async updateBlog(id: string, data: BlogUpdateModel) {
        try {
            let result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {$set: data})
            return result.matchedCount == 1
        } catch (e) {
            return false
        }
    },
    async deleteBlog(id: string) {
        try {
            let result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
            return result.deletedCount === 1
        } catch (e) {
            return false
        }

    },
    async deleteAllBlogs() {
        await blogsCollection.deleteMany({})
        return true
    }
}