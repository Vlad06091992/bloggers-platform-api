// import {PostCreateModel, PostViewModel, UserCreateModel} from "./types/types";
import {UsersModelClass} from "../../mongoose/models";
import {QueryUserModel, ResponseUsersModel, UserType, UserViewModel} from "../users//types/types";
import {ObjectId} from "mongodb";
import {usersService} from "./users-service";


export const usersRepository = {
    async createUser(user: UserType): Promise<UserViewModel> {
        const result = await UsersModelClass.create(user);
        return {
            id: result._id.toString(),
            createdAt: result.createdAt,
            email: result.email,
            login: result.login,
            // registrationData: result.registrationData
        };
    },

    async getUserById(id: string, isNewUser: boolean = false) {
        try {
            let res = await UsersModelClass.findOne({_id: new ObjectId(id)});
            return usersService.getUserWithPrefixIdToViewModel(res!);
        } catch (e) {
            return null;
        }
    },

    async findUserByLoginOrEmail(loginOrEmail: string) {
        const user = await UsersModelClass.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]});
        return user;
    },


    async findUserByConfirmationCode(code: string) {
        const user = await UsersModelClass.findOne({'registrationData.confirmationCode': code});
        return user;
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

const filter = {
    $or: [{
        login: {
            $regex: searchLoginTerm,
            $options: "i"
        }
    }, {email: {$regex: searchEmailTerm, $options: "i"}}]
}

        const totalCount = await UsersModelClass.countDocuments(filter);

        //@ts-ignore
        return await UsersModelClass.pagination(filter, pageNumber, pageSize, sortBy, sortDirection, totalCount, usersService.getUserWithPrefixIdToViewModel)

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
            let result = await UsersModelClass.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (e) {
            return false;
        }
    },
    async deleteAllUsers() {
        await UsersModelClass.deleteMany({});
        return true;
    },
};
