import {blogsCollection} from "../../db-mongo";
import {BlogCreateModel} from "./model/BlogCreateModel";
import {BlogUpdateModel} from "./model/BlogUpdateModel";
import {getBlogViewModel} from "../blogs/blogs-utils/blogs-utils";
import {BlogViewModel} from "../blogs/model/BlogViewModel";
import {BlogType} from "./types/types";

class Blog {
    id: string
    name: string
    websiteUrl: string
    description: string
    isMembership: boolean
    createdAt: string

    constructor({name, websiteUrl, description}: BlogCreateModel) {
        this.id = new Date().getTime().toString()
        this.name = name
        this.description = description
        this.websiteUrl = websiteUrl
        this.isMembership = true
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
       let hz = res.map(el => {
            const {_id, ...blogWithoutPrefixId} = el
           debugger
            return blogWithoutPrefixId
        })
return hz
    },
    async getBlogById(id: string) {
        const blog = await blogsCollection.findOne({id})
        if (blog) {
            const {_id, ...blogWithoutPrefixId} = blog
            return blogWithoutPrefixId
        }
    },
    async createBlog(data: BlogCreateModel) {
        const newBlog: BlogViewModel = new Blog(data)
        if (newBlog) {
            await blogsCollection.insertOne({...newBlog})
        }

        return newBlog
    },
    async updateBlog(id: string, data: BlogUpdateModel) {
        let result = await blogsCollection.updateOne({id}, {$set: data})
        return result.matchedCount == 1
    },
    async deleteBlog(id: string) {
        let result = await blogsCollection.deleteOne({id})
        return result.deletedCount === 1
    },
    async deleteAllBlogs() {
        await blogsCollection.deleteMany({})
        return true
    }
}