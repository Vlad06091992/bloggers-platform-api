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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = void 0;
// import {PostCreateModel, PostViewModel, UserCreateModel} from "./types/types";
const models_1 = require("../mongoose/models");
const mongodb_1 = require("mongodb");
const users_service_1 = require("src/application_example/users-service");
exports.usersRepository = {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const smartUser = new models_1.UsersModelClass(user);
            yield smartUser.save();
            return smartUser;
        });
    },
    getUserById(id, isNewUser = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield models_1.UsersModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
                return users_service_1.usersService.getUserWithPrefixIdToViewModel(res);
            }
            catch (e) {
                return null;
            }
        });
    },
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.UsersModelClass.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });
            return user;
        });
    },
    findUserByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.UsersModelClass.findOne({ 'registrationData.confirmationCode': code });
            return user;
        });
    },
    // async createUser(data: UserCreateModel): Promise<UserViewModel> {
    //   const blogName = (await commentsService.findBlogNameByBlogId(data.blogId))!;
    //   const newPostTemplate = new Post({ ...data, blogName });
    //   const { insertedId } = await usersCollection.insertOne({
    //     ...newPostTemplate,
    //   });
    //   return (await this.getPostById(insertedId.toString()))!;
    // },
    findUsers(reqQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = reqQuery.sortBy || "createdAt";
            const sortDirection = reqQuery.sortDirection || "desc";
            const pageNumber = reqQuery.pageNumber || 1;
            const pageSize = reqQuery.pageSize || 10;
            const searchEmailTerm = reqQuery.searchEmailTerm || "";
            const searchLoginTerm = reqQuery.searchLoginTerm || "";
            const filter = {
                $or: [{
                        login: {
                            $regex: searchLoginTerm,
                            $options: "i"
                        }
                    }, { email: { $regex: searchEmailTerm, $options: "i" } }]
            };
            debugger;
            const totalCount = yield models_1.UsersModelClass.countDocuments(filter);
            //@ts-ignore
            return yield models_1.UsersModelClass.pagination(filter, pageNumber, pageSize, sortBy, sortDirection, totalCount, users_service_1.usersService.getUserWithPrefixIdToViewModel);
            // let res = await UsersModelClass
            //     .find({$or : [{login: { $regex : searchLoginTerm , $options : "i"}}, {email: { $regex : searchEmailTerm , $options : "i"}}]})
            //     .skip((+pageNumber - 1) * +pageSize)
            //     .limit(+pageSize)
            //     .sort({[sortBy]: sortDirection == "asc" ? 1 : -1})
            //     .toArray();
            // return {
            //     pagesCount: Math.ceil(+totalCount / +pageSize),
            //     page: +pageNumber,
            //     pageSize: +pageSize,
            //     totalCount: +totalCount,
            //     items: res.map(usersService.getUserWithPrefixIdToViewModel),
            // };
        });
    },
    // async getPostById(id: string) {
    //   try {
    //     let res = await postsCollection.findOne({ _id: new ObjectId(id) });
    //     return postsService.getPostWithPrefixIdToViewModel(res!);
    //   } catch (e) {
    //     return null;
    //   }
    // },
    //
    // async updatePost(id: string, data: PostUpdateModel) {
    //   try {
    //     let result = await postsCollection.updateOne(
    //       { _id: new ObjectId(id) },
    //       { $set: data },
    //     );
    //     return result.matchedCount === 1;
    //   } catch (e) {
    //     return false;
    //   }
    // },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.UsersModelClass.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                return result.deletedCount === 1;
            }
            catch (e) {
                return false;
            }
        });
    },
    deleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.UsersModelClass.deleteMany({});
            return true;
        });
    },
};
