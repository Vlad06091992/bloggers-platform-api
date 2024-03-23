import { Request } from "express";
import { BlogViewModel } from "./features/blogs/types/types";
import { PostViewModel } from "./features/posts/types/types";
import { VideoViewModel } from "./features/videos/model/VideoViewModel";

export type VideoType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: null | number;
  createdAt: string;
  publicationDate: string;
  availableResolutions?: AvailableResolutionsType[] | null;
};

export type RootDBType = {
  videos: VideoViewModel[];
  posts: PostViewModel[];
  blogs: BlogViewModel[];
};

export type ErrorResponseType = {
  errorsMessages: Array<{ message: string; field: string }>;
};

export enum AvailableResolutions {
  P144 = "P144",
  P240 = "P240",
  P360 = "P360",
  P480 = "P480",
  P720 = "P720",
  P1080 = "P1080",
  P1440 = "P1440",
  P2160 = "P2160"
}

export type AvailableResolutionsType = keyof typeof AvailableResolutions;

export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithBody<T> = Request<{}, {}, T, {}>;
export type RequestWithParams<T> = Request<T, {}, {}, {}>;
export type RequestWithParamsAndBody<T, D> = Request<T, {}, D, {}>;
export type RequestWithQueryAndParams<T, D> = Request<T, {}, {}, D>;
