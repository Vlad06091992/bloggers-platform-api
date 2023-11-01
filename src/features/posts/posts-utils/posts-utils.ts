import {db} from "../../../db";
import {PostType} from "../../../types";

type ResultType = "object" | "boolean"

export const findPostById = (id: string, result: ResultType = "boolean") => {
    const post = db.posts.find((post: PostType) => post.id === id!)
    return result == "boolean" ? !!post : post
}

export const findIndexPostById = (id: string) => {
    const postId = db.posts.findIndex((post: PostType) => post.id === id!)
    return postId
}

export const findBlogNameByBlogId = (id: string) => {
    return db.blogs.find(el => el.id == id)?.name
}
