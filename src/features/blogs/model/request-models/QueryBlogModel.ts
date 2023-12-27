import { BlogType } from "../../types/types";

export type QueryBlogModel = {
  searchNameTerm: string;
  sortBy?: keyof BlogType;
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
};
