import {Result} from "express-validator";

export function createErrorResponse(errors: Result) {
  return {
    errorsMessages: errors.array().map((el) => ({
      message: el.msg,
      field: el.path,
    })),
  };
}
