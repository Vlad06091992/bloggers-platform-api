import { checkSchema } from "express-validator";
import { blogsService } from "../../blogs/blogs-service";
import {usersService} from "../../users/users-service";

const schema = {
  login: {
    errorMessage:
        "The 'login' field is required and must be between 3 and 10 characters long. It can contain only letters, numbers, underscores, and hyphens.",
    trim: true,
    isLength: {
      options: { min: 3, max: 10 },
    },
    exists: true,
    custom: {
      options: async (nameOrLogin: string) => {
        let res = await usersService.findUserByLoginOrEmail(nameOrLogin);
        if (res) {
          return Promise.reject("The provided 'login' is already in use.");
        }
      },
      errorMessage: "The provided 'login' is already in use.",
    },
  },
  password: {
    errorMessage:
        "The 'password' field is required and must be between 6 and 20 characters long.",
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
    isEmail: true,
    exists: true,
    custom: {
      options: async (email: string) => {
        let res = await usersService.findUserByLoginOrEmail(email);
        if (res) {
          return Promise.reject("The provided 'email' is already in use.");
        }
      },
      errorMessage: "The provided 'email' is already in use.",
    },
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

export const validateCreateUserData = checkSchema(schema, [
  "body",
  "query",
  "params",
]);
