import {ValidationError} from "express-validator";
import {blogsService} from "./features/blogs/blogs-service";


type CustomValidationError = (ValidationError & { path: string })[];

export function createErrorResponse(errors: CustomValidationError) {
  return {
    errorsMessages: errors.map((el) => ({
      message: el.msg,
      field:  el.path,
    })),
  };
}

export async function pagination (filter:any,pageNumber:string,pageSize:string,sortBy:string,sortDirection:string,totalCount:string,map_callbak:Function) {
//@ts-ignore
  const res = await this.find(filter)
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .sort({ [sortBy]: sortDirection == "asc" ? 1 : -1 }).lean()
  return {
    pagesCount: Math.ceil(+totalCount / +pageSize),
    page: +pageNumber,
    pageSize: +pageSize,
    totalCount: +totalCount,
    items: res.map(map_callbak),
  };
};


