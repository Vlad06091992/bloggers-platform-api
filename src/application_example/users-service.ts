import {ObjectId, WithId} from "mongodb";
import {UserAuthMeModel, UserCreateModel, UserViewModel} from "../features/users/types/types";

import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid"
import moment, {Moment} from "moment";
import {usersRepository} from "../infrastructure/repostitories/users-repository";
import {UserType} from "../domain/users-types";

type ResultType = "object" | "boolean";

export class User {
    _id:ObjectId;
    createdAt: string;
    registrationData: {
        confirmationCode: string,
        expirationDate: any
        isConfirmed: boolean
    }
    constructor(public email:string,public login:string,public password:string,isConfirmed = false) {
        this._id = new ObjectId();
        this.createdAt = new Date().toISOString();
        this.registrationData = {
            confirmationCode:  uuidv4(),
            expirationDate: moment().add(1,'hour').toString(),
            isConfirmed: isConfirmed
        }
    }
}

export const usersService = {

    async getUserById(id: string) {
        return await usersRepository.getUserById(id)
    },

    async createUser(body: UserCreateModel) {
        const passwordHash = await this._createHash(body.password)
        // const result = new User({...body, password: passwordHash, isConfirmed:body.isConfirmed})
        const result = new User(body.email,body.login,body.password)
        return await usersRepository.createUser(result)
    },

    async _createHash(password: string) {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    },


    getUserWithPrefixIdToViewModel(user: WithId<UserType>): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            createdAt: user.createdAt,
            email: user.email,
        };
    },



    mapUserViewModelToAuthMeUser(user: UserViewModel): UserAuthMeModel {
        return {
            userId: user.id,
            login: user.login,
            email: user.email,
        };
    },


    // getUserWithPrefixIdToViewModel(user: WithId<UserType>): UserViewModel {
    //     return {
    //         userId: user._id.toString(),
    //         login:user.login,
    //         email:user.email,
    //     };
    // },


    async findUserByLoginOrEmail<T>(loginOrEmail: string, result: ResultType = "boolean") {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        return result === "boolean" ? !!user : user;
    },

    async deleteUser(id: string) {
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
//         return await commentsRepository.getPostById(id)
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

