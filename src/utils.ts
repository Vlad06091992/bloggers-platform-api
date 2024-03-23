import { Result, ValidationError } from "express-validator";

type CustomValidationError = (ValidationError & { path: string })[];

export function createErrorResponse(errors: CustomValidationError) {
  return {
    errorsMessages: errors.map((el) => ({
      message: el.msg,
      field:  el.path,
    })),
  };
}

