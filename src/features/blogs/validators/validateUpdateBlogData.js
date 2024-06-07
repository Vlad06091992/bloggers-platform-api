"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateBlogData = void 0;
const express_validator_1 = require("express-validator");
exports.validateUpdateBlogData = (0, express_validator_1.checkSchema)({
    name: {
        errorMessage: "The 'title' field is required and must be no more than 15 characters.",
        trim: true,
        isLength: {
            options: { min: 1, max: 15 },
        },
        exists: true,
    },
    description: {
        errorMessage: "The 'short description' field is required and must be no more than 100 characters.",
        trim: true,
        isLength: {
            options: { min: 1, max: 500 },
        },
        exists: true,
    },
    websiteUrl: {
        errorMessage: "The 'websitUrl' field is required and must be no more than 100 characters.",
        trim: true,
        isLength: {
            options: { min: 1, max: 100 },
        },
        exists: true,
        matches: {
            options: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
            errorMessage: 'you may only use valid website URLs starting with "https://"',
        },
    },
}, ["body", "query", "params"]);
