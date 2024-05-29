import { checkSchema } from "express-validator";
import {blogsService} from "../../../features/blogs/composition-blogs";

const schema = {
  title: {
    errorMessage:
      "The 'title' field is required and must be no more than 15 characters.",
    trim: true,
    isLength: {
      options: { min: 1, max: 30 },
    },
    exists: true,
  },
  shortDescription: {
    errorMessage:
      "The 'short description' field is required and must be no more than 500 characters.",
    trim: true,
    isLength: {
      options: { min: 1, max: 100 },
    },
    exists: true,
  },
  content: {
    errorMessage:
      "The 'websiteUrl' field is required and must be no more than 100 characters.",
    trim: true,
    isLength: {
      options: { min: 1, max: 100 },
    },
    exists: true,
  },
};

const   schemaWithId = {
  ...schema,
  blogId: {
    custom: {
      options: async (id: string) => {
        let res = await blogsService.findBlogById(id);
        if (!res) {
          return Promise.reject();
        }
      },
      errorMessage: "blog is not found",
    },
  },
};

export const validateCreatePostDataWithIdParams = checkSchema(schemaWithId, [
  "body",
  "query",
  "params",
]);
export const validateCreatePostData = checkSchema(schema, [
  "body",
  "query",
  "params",
]);
