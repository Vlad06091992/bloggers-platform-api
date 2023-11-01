import {checkSchema} from "express-validator";
import {findBlogById} from "../blogs-utils/blogs-utils";

export const validateUpdateBlogData =
    checkSchema({
        title: {
            errorMessage: "The 'title' field is required and must be no more than 30 characters.",
            isLength: {
                options: {min: 1, max: 30}

            }, exists: true
        },
        shortDescription: {
            errorMessage: "The 'short description' field is required and must be no more than 100 characters.",
            isLength: {
                options: {min: 1, max: 500}
            }, exists: true
        },
        content: {
            errorMessage: "The 'description' field is required and must be no more than 100 characters.",
            isLength: {
                options: {min: 1, max: 1000}
            }, exists: true
        },
        blogId: {
            custom: {
                options: (id: string) => findBlogById(id),
                errorMessage: 'blog is not found'
            }
        },
    }, ['body', 'query', "params"])