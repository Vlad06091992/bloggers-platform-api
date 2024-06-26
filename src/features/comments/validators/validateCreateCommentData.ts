import { checkSchema } from "express-validator";
import {blogsService} from "../../../features/blogs/composition-blogs";

import {usersService} from "../../users/users-service";

const schema = {
  content: {
    errorMessage:
        "The 'content' field is required and must be between 20 and 300 characters long. It can contain only letters, numbers, underscores, and hyphens.",
    trim: true,
    isLength: {
      options: { min: 20, max: 300 },
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

export const validateCreateCommentData = checkSchema(schema, [
  "body",
  "query",
  "params",
]);
