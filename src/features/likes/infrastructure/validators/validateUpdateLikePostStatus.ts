import {checkSchema} from "express-validator";
import {postsService} from "../../../posts/posts-service";

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
        postId: {
            custom: {
                options: async (id: string) => {
                    let res = await postsService.getPostById(id,null);
                    if (!res) {
                        return Promise.reject();
                    }
                },
                errorMessage: "post is not found",
            },
        },
    },
};



export const validateUpdateLikePostStatus = checkSchema({
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
    postId: {
        custom: {
            options: async (id: string) => {
                let res = await postsService.getPostById(id, null);
                if (!res) {
                    return Promise.reject();
                }
            },
            errorMessage: "post is not found",
        },
    },

},['body',"params","query"]);
