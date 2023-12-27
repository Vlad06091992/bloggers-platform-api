import { BlogViewModel } from "../BlogViewModel";

export type ResponseBlogsModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewModel[];
};
