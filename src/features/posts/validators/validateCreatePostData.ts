/*    id: {
          custom: {
              options: (id: string) => findBlogById(id),
              errorMessage: 'blog is not found'
          }
      },*/


import {checkSchema} from "express-validator";
import {findBlogById} from "../../blogs/blogs-utils/blogs-utils";

export const validateCreatePostData =
    checkSchema({
        title: {
            errorMessage: "The 'title' field is required and must be no more than 15 characters.",
            trim:true,
            isLength: {
                options: {min: 1, max: 30}

            }, exists: true
        },
        shortDescription: {
            errorMessage: "The 'short description' field is required and must be no more than 500 characters.",
            trim:true,
            isLength: {
                options: {min: 1, max: 100}
            }, exists: true
        },
        content: {
            errorMessage: "The 'websiteUrl' field is required and must be no more than 100 characters.",
            trim:true,
            isLength: {
                options: {min: 1, max: 100}
            }, exists: true,
        },
        BlogId: {
            custom: {
                options: (id: string) => findBlogById(id),
                errorMessage: 'blog is not found'
            }
        }
    }, ['body'])
