import {checkSchema} from "express-validator";
import {blogsService} from "../../blogs/blogs-service";

const schema = {
  loginOrEmail: {
    custom: {
      options: (value: any) => {
        if (typeof value !== 'string') {
          throw new Error("The field must be a string.");
        }
        return true;
      },
      errorMessage: "The field must be a string.",
    },
    trim: true,
    matches: {
      options: /^[a-zA-Z0-9_-]*$/,
      errorMessage: "The field can contain only letters, numbers, underscores, and hyphens.",
    },
  },
  password: {
    custom: {
      options: (value: any) => {
        if (typeof value !== 'string') {
          throw new Error("The field must be a string.");
        }
        return true;
      },
      errorMessage: "The field must be a string.",
    },
    trim: true,
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
export const validateAuthUserData = checkSchema(schema, [
  "body",
  "query",
  "params",
]);
