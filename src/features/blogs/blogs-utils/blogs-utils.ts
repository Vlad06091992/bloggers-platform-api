import {blogsCollection} from "../../../db-mongo";
import {WithId} from "mongodb";
import {BlogType} from "../types/types";
import {BlogViewModel} from "../model/BlogViewModel";

type ResultType = "object" | "boolean"

export const findBlogById = async (id: string, result: ResultType = "boolean") => {
    const blog = await blogsCollection.findOne({id})
    return result == "boolean" ? !!blog : blog
}

// export const findIndexBlogById = (id: string) => {
//     const blogId = db.blogs.findIndex((blog: BlogViewModel) => blog.id === id!)
//     return blogId
// }
//
export const getBlogWithPrefixIdToViewModel = (blog: WithId<BlogType>): BlogViewModel => {
    return {id:blog._id.toString(),createdAt:blog.createdAt,description:blog.description,name:blog.name,websiteUrl:blog.websiteUrl, isMembership:blog.isMembership}
}