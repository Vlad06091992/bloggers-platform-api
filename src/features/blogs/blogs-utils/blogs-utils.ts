import {db} from "../../../db";
import {BlogViewModel} from "../model/BlogViewModel";
import {blogsCollection} from "../../../db-mongo";
import {BlogType} from "../types/types";

type ResultType = "object" | "boolean"

export const findBlogById = async (id: string, result: ResultType = "boolean") => {
    const blog = await blogsCollection.findOne({id})
    return result == "boolean" ? !!blog : blog
}

export const findIndexBlogById = (id: string) => {
    const blogId = db.blogs.findIndex((blog: BlogViewModel) => blog.id === id!)
    return blogId
}

export const getBlogViewModel = (blog: BlogType): BlogViewModel => {
    const {_id, ...blogWithoutPrefixId} = blog
    return blog
}