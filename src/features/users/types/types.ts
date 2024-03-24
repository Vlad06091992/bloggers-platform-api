export type UserType = {
    login: string;
    email: string
    createdAt: string;
    password:string
};

export type UserViewModel =  {
    id: string;
    login: string;
    email: string
    createdAt: string
};

export type UserAuthMeModel =  {
    id: string;
    login: string;
    email: string
};

// export type UserViewModel =  {
//     userId: string;
//     login: string;
//     email: string
// };

export type UserCreateModel = {
    login: string;
    email: string
    password: string;
    createdAt: string
};



export type QueryUserModel = {
    sortBy?: string;
    sortDirection?:  "asc" | "desc";
    pageNumber?: number;
    pageSize?: number;
    searchLoginTerm?: string | null;
    searchEmailTerm?: string | null;
};





//
//
//
// export type PostUpdateModel = {
//   title: string;
//   shortDescription: string;
//   content: string;
//   blogId: string;
// };
//


export type URIParamsUserIdModel = {
  /** Id of existing video */
  id: string;
};


//
export type ResponseUsersModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserViewModel[];
};

// export type CreatePostModelForSpecificBlog = Omit<PostCreateModel, "blogId">;