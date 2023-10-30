import {db} from "../../db";
import {PostType} from "../../types";

export const postsRepository = {
    findPosts(title: string | null) {
        let foundedPosts = db.posts

        if (title) {
            foundedPosts = foundedPosts.filter(el => el.title.indexOf(title) > -1)
        }
        return foundedPosts
    },
    getPostsById(id: string) {
        const post = db.posts.find((el: PostType) => el.id === id)
        if (post) {
            return post

        }
    },
}