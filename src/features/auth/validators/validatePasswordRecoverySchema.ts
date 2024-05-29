import {checkSchema} from "express-validator";

const schema = {
    email: {
        errorMessage:
            "The 'email' field is required and must be a valid email address.",
        trim: true,
        isEmail: true,
        exists: true,
    },
};

export const validatePasswordRecoverySchema = checkSchema(schema, [
    "body",
]);