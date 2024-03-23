
import {ObjectId, WithId} from "mongodb";
import {UserCreateModel} from "./types/types";
import {usersRepository} from "./users-repository";
import {postsCollection} from "../../db-mongo";

type ResultType = "object" | "boolean";

export const usersService = {

    async createUser(body:UserCreateModel){
        return await usersRepository.createPost(body)
    },

//     async findPostById(id: string, result: ResultType = "boolean") {
//         const post = await postsCollection.findOne({ _id: new ObjectId(id) });
//         return result === "boolean" ? !!post : post;
//     },
//
//
//
//     async getPostById(id:string){
//         return await usersRepository.getPostById(id)
//     },
//
//
//     async findPostsForSpecificBlog(reqQuery: QueryPostModel, id: string) {
//         const sortBy = reqQuery.sortBy || "createdAt";
//         const sortDirection = reqQuery.sortDirection || "desc";
//         const pageNumber = reqQuery.pageNumber || 1;
//         const pageSize = reqQuery.pageSize || 10;
//
//         const totalCount = await postsCollection.countDocuments({ blogId: id });
//         let res = await postsCollection
//             .find({ blogId: id })
//             .skip((+pageNumber - 1) * +pageSize)
//             .limit(+pageSize)
//             .sort({ [sortBy]: sortDirection == "asc" ? 1 : -1 })
//             .toArray();
//         return {
//             pagesCount: Math.ceil(+totalCount / +pageSize),
//             page: +pageNumber,
//             pageSize: +pageSize,
//             totalCount: +totalCount,
//             items: res.map(this.getPostWithPrefixIdToViewModel),
//         };
//     },
//
//     async deletePost(id:string){
//         return await usersRepository.deletePost(id)
// },
//
//     getPostWithPrefixIdToViewModel(post: WithId<PostType>): PostViewModel {
//         return {
//             id: post._id.toString(),
//             blogId: post.blogId,
//             title: post.title,
//             blogName: post.blogName,
//             shortDescription: post.shortDescription,
//             content: post.content,
//             createdAt: post.createdAt,
//         };
//     },
//


    // findIndexPostById(id: string) {
    //     const postId = db.posts.findIndex((post: PostViewModel) => post.id === id);
    //     return postId;
    // }
};

