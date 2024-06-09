import mongoose, {HydratedDocument, Model} from "mongoose";
import {ObjectId} from "mongodb";
import {usersService} from "../../users/users-service";
 type LikeStatus = "Like" | "Dislike"

class Reaction {
     _id:ObjectId
    createdAt:Date
     constructor(
         public authorId: string,
         public postId: string,
         public login: string,
         public status: "Like" | "Dislike",
     ) {
         this._id = new ObjectId()
         this.createdAt = new Date()
     }
}

export type LikesPostType = {
    _id: ObjectId,
    createdAt:Date,
    status:string,
    authorId:string,
    postId:string
    login:string
}

export type LikesPostInstanceMethods = {
    changeStatus: (status:LikeStatus) => boolean
}

export type LikesPostStaticMethods = {
    createReaction: (authorId: string, postId: string, status: "Like" | "Dislike") => HydratedDocument<LikesPostType, LikesPostInstanceMethods>
};
export type LikesPostSchemaType = Model<LikesPostType, {}, LikesPostInstanceMethods> & LikesPostStaticMethods


export const LikesPostSchema = new mongoose.Schema<LikesPostType, LikesPostSchemaType, LikesPostInstanceMethods>({
    _id: {type: mongoose.Schema.Types.ObjectId, require: true},
    createdAt: {type: Date, required: true},
    status: {type:  String, required: true},
    authorId: {type: String, required: true},
    postId: {type: String, require: true},
    login: {type: String, require: true},

})

LikesPostSchema.method('changeStatus', function (status:LikeStatus) {
    const that = this as unknown as LikesPostType & LikesPostInstanceMethods
     that.status = status
}) //создается у экземпляра
LikesPostSchema.static('createReaction', async function (authorId: string, postId: string, status: "Like" | "Dislike") {
    const {login} = (await usersService.getUserById(authorId))!

    console.log(login)

    const reaction = new Reaction(authorId,postId,login,status)
    const result = await this.create(reaction)
    return reaction
}) //создается у класса

LikesPostSchema.static('deleteReactionByPostId', async function (postId: string) {
    await this.deleteOne({postId})
    return true
}) //создается у класса

