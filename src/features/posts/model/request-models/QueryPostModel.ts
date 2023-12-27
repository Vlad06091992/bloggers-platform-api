import { PostType } from "../../types/types";

export type QueryPostModel = {
  sortBy?: keyof PostType;
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
};
