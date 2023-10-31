import {db} from "../../db";
import {BlogType, PostType} from "../../types";
import {BlogCreateModel} from "./model/BlogCreateModel";

class Blog {
    id: string
    name: string
    websiteUrl: string
    description: string

    constructor({name, websiteUrl, description}: BlogCreateModel) {
        this.id = new Date().toString()
        this.name = name
        this.description = description
        this.websiteUrl = websiteUrl
    }
}

export const blogsRepository = {
    findBlogs(name: string | null) {
        let foundedBlogs = db.blogs
        if (name) {
            foundedBlogs = foundedBlogs.filter(el => el.name.indexOf(name) > -1)
        }
        return foundedBlogs
    },
    getBlogById(id: string) {
        const blog = db.blogs.find((el: BlogType) => el.id === id)
        if (blog) {
            return blog

        }
    },
    createBlog(data: BlogCreateModel) {
        debugger
        const newBlog = new Blog(data)
        db.blogs.push(newBlog)
        return newBlog
    }
}