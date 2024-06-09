import {ObjectId} from "mongodb";
import {LikeStatusType} from "../../likes/likes-comments-types";

export type CommentContent = {
    content:string
}

export type CommentType = {
    _id:ObjectId;
    postId: string
    "commentatorInfo": {
        "userId": string,
        "userLogin": string
    },
    "createdAt": string
} & CommentContent

export type CommentCreateModel  ={
    postId: string
    "content": string,
    "commentatorInfo": {
        "userId": string,
        "userLogin": string
    },
}

export type CommentUpdateModel  ={
    content:string
}

export type CommentViewModel = {
    id: string
    "content": string,
    "commentatorInfo": {
    "userId": string,
        "userLogin": string
},
    "createdAt": string
    likesInfo:{
        likesCount:number,
        dislikesCount:number,
        myStatus:LikeStatusType
    }

}

// export type UserViewModel =  {
//     userId: string;
//     login: string;
//     email: string
// };
//
// export type UserCreateModel = {
//     login: string;
//     email: string
//     password: string;
//     createdAt: string
// };
//
//
//
export type QueryCommentModel = {
    sortBy?: string;
    sortDirection?:  "asc" | "desc";
    pageNumber?: number;
    pageSize?: number;
};
//
//
//
//
//
// //
// //
// //
// // export type PostUpdateModel = {
// //   title: string;
// //   shortDescription: string;
// //   content: string;
// //   blogId: string;
// // };
// //
//
//
export type URIParamsCommentsIdModel = {
  /** Id of existing video */
  id: string;
};
//
//
// //
// export type ResponseUsersModel = {
//   pagesCount: number;
//   page: number;
//   pageSize: number;
//   totalCount: number;
//   items: UserViewModel[];
// };
//
// // export type CreatePostModelForSpecificBlog = Omit<PostCreateModel, "blogId">;