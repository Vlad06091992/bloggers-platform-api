import {Request, Response, Router} from "express";

export type VideoType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: null | number;
  createdAt: string;
  publicationDate: string;
  availableResolution?: AvailableResolutionsType[] | null;
}

export type RootDBType = {
  videos:VideoType[]
}

export type AvailableResolutionsType = 'P144'| 'P240'| 'P360'| 'P480'| 'P720'| 'P1080'| 'P1440'| 'P2160'

export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithBody<T> = Request<{}, {}, T, {}>
export type RequestWithParams<T> = Request<T, {}, {}, {}>
export type RequestWithParamsAndBody<T,D> = Request<T, {}, D, {}>