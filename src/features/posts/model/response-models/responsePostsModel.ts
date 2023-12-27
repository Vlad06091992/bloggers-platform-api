import { PostViewModel } from "../PostViewModel";

export type ResponsePostsModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModel[];
};
