import {checkSchema} from "express-validator";

const schema = {
    recoveryCode: {
        errorMessage:
            "The 'recoveryCode' field is required and must be string",
        trim: true,
        exists: true,
        isLength: {
            options: { min: 1, max: 200 },
        },
    },
    newPassword: {
        errorMessage:
            "The 'newPassword' field is required and must be between 6 and 20 characters long.",
        trim: true,
        isLength: {
            options: { min: 6, max: 20 },
        },
        exists: true,
    },


};



export const validateNewPasswordSchema = checkSchema(schema, [
    "body",
    "query",
    "params",
]);
