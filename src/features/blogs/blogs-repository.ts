import {db} from "../../db";
import {BlogType} from "../../types";
import {BlogCreateModel} from "./model/BlogCreateModel";
import {BlogUpdateModel} from "./model/BlogUpdateModel";
import {findIndexBlogById} from "./blogs-utils/blogs-utils";

class Blog {
    id: string
    name: string
    websiteUrl: string
    description: string

    constructor({name, websiteUrl, description}: BlogCreateModel) {
        this.id = new Date().getTime().toString()
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
        const newBlog = new Blog(data)
        db.blogs.push(newBlog)
        return newBlog
    },
    updateBlog(id: string, data: BlogUpdateModel) {
        const blogIndex = findIndexBlogById(id)
        db.blogs[blogIndex] = {...db.blogs[blogIndex], ...data}
    },
    deleteBlog(id: string) {
        const blogIndex = findIndexBlogById(id)

        if (blogIndex > -1) {
            db.blogs.splice(blogIndex, 1)
            return true
        } else {
            return false
        }
    }
}