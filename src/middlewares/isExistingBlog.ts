import { NextFunction } from "express";
import express, { Response } from "express";
import { HTTP_STATUSES } from "../http_statuses/http_statuses";
import {blogsService} from "../features/blogs/composition-blogs";

export const isExistingBlog = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  let result = await blogsService.findBlogById(req.params.id);
  if (result) {
    next();
  } else {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
};
