import { checkSchema } from "express-validator";
import { blogsService } from "../../blogs/blogs-service";

const schema = {
  login: {
    errorMessage:
        "The 'login' field is required and must be between 3 and 10 characters.",
    trim: true,
    isLength: {
      options: { min: 3, max: 10 },
    },
    matches: {
      options: /^[a-zA-Z0-9_-]*$/,
    },
    exists: true,
  },
  password: {
    errorMessage:
        "The 'password' field is required and must be between 6 and 20 characters.",
    trim: true,
    isLength: {
      options: { min: 6, max: 20 },
    },
    exists: true,
  },
  email: {
    errorMessage:
        "The 'email' field is required and must be a valid email address.",
    trim: true,
    matches: {
      options: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    exists: true,
  },
};

const schemaWithId = {
  ...schema,
  blogId: {
    custom: {
      options: async (id: string) => {
        let res = await blogsService.findBlogById(id);
        if (!res) {
          return Promise.reject("Blog is not found");
        }
      },
      errorMessage: "Blog is not found",
    },
  },
};

export const validateCreatePostDataWithIdParams = checkSchema(schemaWithId, [
  "body",
  "query",
  "params",
]);
export const validateCreateUserData = checkSchema(schema, [
  "body",
  "query",
  "params",
]);
