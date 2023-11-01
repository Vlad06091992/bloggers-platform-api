import {db} from "../../../db";
import {BlogType} from "../../../types";

type ResultType = "object" | "boolean"

export const findBlogById = (id: string, result: ResultType = "boolean") => {
    const blog = db.blogs.find((blog: BlogType) => blog.id === id!)
    return result == "boolean" ? !!blog : blog
}

export const findIndexBlogById = (id: string) => {
    const blogId = db.blogs.findIndex((blog: BlogType) => blog.id === id!)
    return blogId
}