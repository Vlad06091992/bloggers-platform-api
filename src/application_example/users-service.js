"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const mongodb_1 = require("mongodb");
const users_repository_1 = require("src/features/users/users-repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
class User {
    constructor({ email, password, login, isConfirmed = false, confirmationCode }) {
        this._id = new mongodb_1.ObjectId();
        this.email = email;
        this.password = password;
        this.login = login;
        this.createdAt = new Date().toISOString();
        this.registrationData = {
            confirmationCode: confirmationCode || (0, uuid_1.v4)(),
            expirationDate: (0, moment_1.default)().add(1, 'hour').toString(),
            isConfirmed: isConfirmed
        };
    }
}
exports.usersService = {
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_repository_1.usersRepository.getUserById(id);
        });
    },
    createUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield this._createHash(body.password);
            const result = new User(Object.assign(Object.assign({}, body), { password: passwordHash, isConfirmed: body.isConfirmed }));
            return yield users_repository_1.usersRepository.createUser(result);
        });
    },
    _createHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            return yield bcrypt_1.default.hash(password, salt);
        });
    },
    getUserWithPrefixIdToViewModel(user) {
        return {
            id: user._id.toString(),
            login: user.login,
            createdAt: user.createdAt,
            email: user.email,
        };
    },
    mapUserViewModelToAuthMeUser(user) {
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
    findUserByLoginOrEmail(loginOrEmail, result = "boolean") {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findUserByLoginOrEmail(loginOrEmail);
            return result === "boolean" ? !!user : user;
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_repository_1.usersRepository.deleteUser(id);
        });
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
