import {WithId} from "mongodb";
import {UserCreateModel, UserType, UserViewModel} from "./types/types";
import {usersRepository} from "./users-repository";
import bcrypt from "bcrypt";

type ResultType = "object" | "boolean";

class User {
    email: string;
    password: string;
    login: string;
    createdAt: string;

    constructor({ email, password, login }: UserCreateModel) {
        this.email = email;
        this.password = password;
        this.login = login;
        this.createdAt = new Date().toISOString();
    }
}



export const usersService = {

    async createUser(body: UserCreateModel) {
        const passwordHash = await this._createHash(body.password)
        const result = new User({...body,password:passwordHash})
        return await usersRepository.createUser(result)
    },

    async _createHash(password:string){
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password,salt)
    },




    getUserWithPrefixIdToViewModel(user: WithId<UserType>): UserViewModel {
        return {
            id: user._id.toString(),
            login:user.login,
            createdAt:user.createdAt,
            email:user.email,
        };
    },

        async findUserByLoginOrEmail<T>(emailOrlogin: string, result: ResultType = "boolean") {
        const user = await usersRepository.findUserByLoginOrEmail(emailOrlogin)
        return result === "boolean" ? !!user : user;
    },

    async deleteUser(id:string){
        return await usersRepository.deleteUser(id)
    },

    // async checkCredentials(loginOrEmail:string,password:string){
    //
    //     },

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
