import {blogsCollection} from "../../db-mongo";
import {BlogCreateModel} from "./model/BlogCreateModel";
import {BlogUpdateModel} from "./model/BlogUpdateModel";
import {BlogViewModel} from "./model/BlogViewModel";
import {getBlogWithPrefixIdToViewModel} from "./blogs-utils/blogs-utils";
import {ObjectId} from "mongodb";
import {BlogType} from "./types/types";

//TODO обработка ошибок (try catch) на случай если БД легла(какой статус код отправлять ?)
//TODO Юзать монгошную айдишку для сущностей
//TODO подправить типы
//TODO middleware для errros в роутах
//TODO типизицаия(убрать any)

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
        let hz: BlogViewModel[] = res.map(el => {
            return getBlogWithPrefixIdToViewModel(el)
        })
        return hz
    },
    async getBlogById(id: string): Promise<any> {
        try {
            let res = await blogsCollection.findOne({_id: new ObjectId(id)})
            return getBlogWithPrefixIdToViewModel(res!)
        } catch (e){
            return null
        }
    },
    async createBlog(data: BlogCreateModel) {
        const newBlogTemplate = new BlogCreateClass(data)
        if (newBlogTemplate) {
            try {
                let {insertedId} = await blogsCollection.insertOne(newBlogTemplate)
                let blog = await this.getBlogById(insertedId.toString())
                return blog
            } catch (e) {

            }
        }
        // return newBlogTemplate
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