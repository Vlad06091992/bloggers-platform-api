import {db} from "../../db";

export const postsRepository = {
    findPosts(title: string | null) {
        let foundedPosts = db.posts

        if (title) {
            foundedPosts = foundedPosts.filter(el => el.title.indexOf(title) > -1)
        }
        return foundedPosts
    }
}