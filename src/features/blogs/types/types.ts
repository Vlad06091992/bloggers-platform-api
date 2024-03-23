export type BlogType = {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: string;
};

export type BlogCreateModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogUpdateModel = {
  name: string;
  description: string;
  websiteUrl: string;
};


export type QueryBlogModel = {
  searchNameTerm: string;
  sortBy?: keyof BlogType;
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
};

export type URIParamsBlogIdModel = {
  /** Id of existing blog */
  id: string;
};
export type ResponseBlogsModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewModel[];
};

export type BlogViewModel = BlogType & { id: string }; // (id:string)
export type BlogInMongoDB = BlogType & { _id: string }; // (_id:string)




