import { NextFunction } from "express";
import express, { Response } from "express";
import { findBlogById } from "../features/blogs/blogs-utils/blogs-utils";
import { HTTP_STATUSES } from "../http_statuses/http_statuses";

export const isExistingBlog = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  let result = await findBlogById(req.params.id);
  if (result) {
    next();
  } else {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
};
