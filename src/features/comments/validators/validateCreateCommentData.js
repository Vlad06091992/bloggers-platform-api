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
exports.validateCreateCommentData = void 0;
const express_validator_1 = require("express-validator");
const blogs_service_1 = require("../../blogs/blogs-service");
const schema = {
    content: {
        errorMessage: "The 'content' field is required and must be between 3 and 10 characters long. It can contain only letters, numbers, underscores, and hyphens.",
        trim: true,
        isLength: {
            options: { min: 20, max: 300 },
        },
        exists: true,
    },
};
const schemaWithId = Object.assign(Object.assign({}, schema), { blogId: {
        custom: {
            options: (id) => __awaiter(void 0, void 0, void 0, function* () {
                let res = yield blogs_service_1.blogsService.findBlogById(id);
                if (!res) {
                    return Promise.reject("Blog is not found");
                }
            }),
            errorMessage: "Blog is not found",
        },
    } });
exports.validateCreateCommentData = (0, express_validator_1.checkSchema)(schema, [
    "body",
    "query",
    "params",
]);
