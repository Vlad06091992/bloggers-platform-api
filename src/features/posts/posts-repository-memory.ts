import {db} from "../../db";

import {PostCreateModel} from "src/features/posts/model/request-models/PostCreateModel";
import {PostUpdateModel} from "src/features/posts/model/request-models/PostUpdateModel";
import {findBlogNameByBlogId, findIndexPostById} from "./posts-utils/posts-utils";
import {PostViewModel} from "./model/PostViewModel";

class Post {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;

    constructor({blogId, title, shortDescription, content}: PostCreateModel) {
        this.id = new Date().getTime().toString()
        this.blogId = blogId
        this.blogName = findBlogNameByBlogId(blogId)!
        this.title = title
        this.content = content
        this.shortDescription = shortDescription

    }
}

export const postsRepositoryMemory = {
    findPosts(title: string | null) {
        let foundedPosts = db.posts

        if (title) {
            foundedPosts = foundedPosts.filter(el => el.title.indexOf(title) > -1)
        }
        return foundedPosts
    },
    getPostById(id: string) {
        const post = db.posts.find((el: PostViewModel) => el.id === id)
        if (post) {
            return post

        }
    },
    createPost(data: PostCreateModel) {
        const newPost = new Post(data)
        db.posts.push(newPost)
        return newPost
    },
    updatePost(id: string, data: PostUpdateModel) {
        const postIndex = findIndexPostById(id)
        db.posts[postIndex] = {...db.posts[postIndex], ...data}
    },
    deletePost(id: string) {
        const postIndex = findIndexPostById(id)
        if (postIndex > -1) {
            db.posts.splice(postIndex, 1)
            return true
        } else {
            return false
        }
    }
}