import {CustomValidator, Result, ValidationError, validationResult} from "express-validator";
import { HTTP_STATUSES } from "../http_statuses/http_statuses";
import { createErrorResponse } from "../utils";
import { NextFunction, Request, Response } from "express";

export const validateErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors  = <(ValidationError & { path: string })[]>validationResult(req).array({ onlyFirstError: true });
  console.log(errors)

  if(errors[0] && errors[0].path === 'postId'){
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return
  }

  if (errors.length) {
    res.status(HTTP_STATUSES.BAD_REQUEST_400).send(createErrorResponse(errors));
  } else {
    next();
  }
};
