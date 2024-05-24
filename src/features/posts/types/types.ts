import {ObjectId} from "mongodb";

export type PostType = {
  _id:ObjectId
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostCreateModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};



export type PostUpdateModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type QueryPostModel = {
  sortBy?: keyof PostType;
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
};

export type URIParamsPostIdModel = {
  /** Id of existing video */
  id: string;
};

export type PostViewModel =Omit< PostType & { id: string; }, '_id'>;

export type ResponsePostsModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModel[];
};

export type CreatePostModelForSpecificBlog = Omit<PostCreateModel, "blogId">;