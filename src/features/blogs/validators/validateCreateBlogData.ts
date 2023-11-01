import {checkSchema} from "express-validator";

export const validateCreateBlogData =
    checkSchema({
        name: {
            errorMessage: "The 'name' field is required and must be no more than 15 characters.",
            trim:true,
            isLength: {
                options: {min: 1, max: 15}

            }, exists: true
        },
        description: {
            errorMessage: "The 'description' field is required and must be no more than 500 characters.",
            trim:true,
            isLength: {
                options: {min: 1, max: 500}
            }, exists: true
        },
        websiteUrl: {
            errorMessage: "The 'websitUrl' field is required and must be no more than 100 characters.",
            trim:true,
            isLength: {
                options: {min: 1, max: 100}
            }, exists: true,
            matches: {
                options: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
                errorMessage: 'you may only use valid website URLs starting with "https://"'
            },
        }
    }, ['body'])