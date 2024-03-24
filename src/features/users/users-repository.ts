// import {PostCreateModel, PostViewModel, UserCreateModel} from "./types/types";
import {usersCollection} from "../../db-mongo";
import {QueryUserModel, UserCreateModel, UserViewModel, ResponseUsersModel} from "../users//types/types";
import {ObjectId} from "mongodb";
import {usersService} from "./users-service";
// import {commentsService} from "./";

// type CreatePostForClass = PostCreateModel & {
//   blogName: string;
// };


export const usersRepository = {

    async createUser(user: UserCreateModel): Promise<UserViewModel> {
        const {insertedId} = await usersCollection.insertOne(user);
        return (await this.getUserById(insertedId.toString()))!;
    },

    async getUserById(id: string) {
        try {
            let res = await usersCollection.findOne({_id: new ObjectId(id)});
            return usersService.getUserWithPrefixIdToViewModel(res!);
        } catch (e) {
            return null;
        }
    },

    async findUserByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({ $or:[{login:loginOrEmail},{email:loginOrEmail}] });
        return  user;
    },

    // async createUser(data: UserCreateModel): Promise<UserViewModel> {
    //   const blogName = (await commentsService.findBlogNameByBlogId(data.blogId))!;
    //   const newPostTemplate = new Post({ ...data, blogName });
    //   const { insertedId } = await usersCollection.insertOne({
    //     ...newPostTemplate,
    //   });
    //   return (await this.getPostById(insertedId.toString()))!;
    // },


    async findUsers(reqQuery: QueryUserModel): Promise<ResponseUsersModel> {
        const sortBy = reqQuery.sortBy || "createdAt";
        const sortDirection = reqQuery.sortDirection || "desc";
        const pageNumber = reqQuery.pageNumber || 1;
        const pageSize = reqQuery.pageSize || 10;
        const searchEmailTerm = reqQuery.searchEmailTerm || "";
        const searchLoginTerm = reqQuery.searchLoginTerm || "";


        const totalCount = await usersCollection.countDocuments({$or : [{login: { $regex : searchLoginTerm , $options : "i"}}, {email: { $regex : searchEmailTerm , $options : "i"}}]});
        let res = await usersCollection
            .find({$or : [{login: { $regex : searchLoginTerm , $options : "i"}}, {email: { $regex : searchEmailTerm , $options : "i"}}]})
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .sort({[sortBy]: sortDirection == "asc" ? 1 : -1})
            .toArray();
        return {
            pagesCount: Math.ceil(+totalCount / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: res.map(usersService.getUserWithPrefixIdToViewModel),
        };
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
    async deleteUser(id: string) {
      try {
        let result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
      } catch (e) {
        return false;
      }
    },
    async deleteAllUsers() {
      await usersCollection.deleteMany({});
      return true;
    },
};
