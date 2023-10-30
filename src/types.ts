import {Request, Response, Router} from "express";
import exp from "constants";

export type VideoType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: null | number;
    createdAt: string;
    publicationDate: string;
    availableResolutions?: AvailableResolutionsType[] | null;
}

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

export type PostType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
}

export type RootDBType = {
    videos: VideoType[],
    posts: PostType[],
    blogs: BlogType[]
}

export type ErrorResponseType = {
    errorsMessages: Array<{ message: string, field: string }>
}

export type AvailableResolutionsType = 'P144' | 'P240' | 'P360' | 'P480' | 'P720' | 'P1080' | 'P1440' | 'P2160'

export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithBody<T> = Request<{}, {}, T, {}>
export type RequestWithParams<T> = Request<T, {}, {}, {}>
export type RequestWithParamsAndBody<T, D> = Request<T, {}, D, {}>