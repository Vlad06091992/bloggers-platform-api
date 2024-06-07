"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatePostDataWithParams = void 0;
const express_validator_1 = require("express-validator");
const blogs_service_1 = require("../../blogs/blogs-service");
exports.validateUpdatePostDataWithParams = (0, express_validator_1.checkSchema)({
    title: {
        errorMessage: "The 'title' field is required and must be no more than 15 characters.",
        trim: true,
        isLength: {
            options: { min: 1, max: 30 },
        },
        exists: true,
    },
    shortDescription: {
        errorMessage: "The 'short description' field is required and must be no more than 500 characters.",
        trim: true,
        isLength: {
            options: { min: 1, max: 100 },
        },
        exists: true,
    },
    content: {
        errorMessage: "The 'websiteUrl' field is required and must be no more than 100 characters.",
        trim: true,
        isLength: {
            options: { min: 1, max: 100 },
        },
        exists: true,
    },
    blogId: {
        custom: {
            options: (id) => __awaiter(void 0, void 0, void 0, function* () {
                let res = yield blogs_service_1.blogsService.findBlogById(id);
                if (!res) {
                    return Promise.reject();
                }
            }),
            errorMessage: "blog is not found",
        },
    },
}, ["body", "query", "params"]);
