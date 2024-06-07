// import {PostCreateModel, PostViewModel, UserCreateModel} from "./types/types";
import {UsersModelClass} from "../mongoose/models";
import {QueryUserModel, ResponseUsersModel} from "../../features/users/types/types";
import {ObjectId, WithId} from "mongodb";
import {usersService} from "../../application_example/users-service";
import {UserType} from "../../domain/users-types";


export const usersRepository = {

    async save<T extends {save:()=>Promise<void>}>(user:T ):Promise<void>{
        return await user.save()
    },

    async  createUser(user: UserType): Promise<WithId<UserType>> {
        const smartUser = new UsersModelClass(user);
        await smartUser.save()
        return smartUser
    },

    async updateConfirmation(_id:ObjectId){

        console.log(_id)

        try {
            let result = await UsersModelClass.updateOne(
                {_id},
                {$set: {'registrationData.isConfirmed': true}}
            );
            return result.matchedCount == 1;
        } catch (e) {
            return false;
        }
    },


    async getUserById(id: string, isNewUser: boolean = false) {
        try {
            let res = await UsersModelClass.findOne({_id: new ObjectId(id)});
            // return usersService.getUserWithPrefixIdToViewModel(res!);
            return  res
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
debugger
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
