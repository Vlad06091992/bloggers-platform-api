import {db} from "../../../db";
// import {PostViewModel} from "./models/PostViewModel"
import {PostViewModel} from "../model/PostViewModel"
import {postsCollection} from "../../../db-mongo";

type ResultType = "object" | "boolean"

export const findPostById = (id: string, result: ResultType = "boolean") => {
    const post = postsCollection.findOne({id})
    return result == "boolean" ? !!post : post
}

export const findIndexPostById = (id: string) => {
    const postId = db.posts.findIndex((post: PostViewModel) => post.id === id!)
    return postId
}

export const findBlogNameByBlogId = (id: string) => {
    return db.blogs.find(el => el.id == id)?.name
}
