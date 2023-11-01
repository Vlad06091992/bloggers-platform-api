import {db} from "../../../db";
import {BlogType} from "../../../types";

export const findBlogById = (id: string) => {
    debugger
    const blog = db.blogs.find((blog: BlogType) => blog.id === id!)
    return !!blog
}