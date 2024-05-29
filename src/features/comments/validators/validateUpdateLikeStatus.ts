import {checkSchema} from "express-validator";

const schema = {
    likeStatus: {
        exists: true,
        custom: {
            options: (value: string) => {
                if (value != "None" && value !== "Like" && value !== "Dislike") {
                    throw new Error();
                }
                return true;
            },
            errorMessage: "The 'likeStatus' field is required and must be None|Like|Dislike",
        },
    },
};



export const validateUpdateLikeStatus = checkSchema(schema,['body']);
