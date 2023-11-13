import {db} from "../../../db";
// import {PostViewModel} from "./models/PostViewModel"
import {PostViewModel} from "../model/PostViewModel"
import {postsCollection} from "../../../db-mongo";
import {blogsCollection} from "../../../db-mongo";

type ResultType = "object" | "boolean"

export const findPostById = async (id: string, result: ResultType = "boolean") => {
    const post = await postsCollection.findOne({id})
    return result == "boolean" ? !!post : post
}

export const findBlogNameByBlogId = async (blogId: string) => {
    const blog = await blogsCollection.findOne({id: blogId})
    return blog?.name
}

export const findIndexPostById = (id: string) => {
    const postId = db.posts.findIndex((post: PostViewModel) => post.id === id!)
    return postId
}


