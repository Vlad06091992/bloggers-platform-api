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
exports.validateCreateUserData = void 0;
const express_validator_1 = require("express-validator");
const blogs_service_1 = require("../../blogs/blogs-service");
const users_service_1 = require("src/application_example/users-service");
const schema = {
    login: {
        errorMessage: "The 'login' field is required and must be between 3 and 10 characters long. It can contain only letters, numbers, underscores, and hyphens.",
        trim: true,
        isLength: {
            options: { min: 3, max: 10 },
        },
        exists: true,
        custom: {
            options: (nameOrLogin) => __awaiter(void 0, void 0, void 0, function* () {
                let res = yield users_service_1.usersService.findUserByLoginOrEmail(nameOrLogin);
                if (res) {
                    return Promise.reject("The provided 'login' is already in use.");
                }
            }),
            errorMessage: "The provided 'login' is already in use.",
        },
    },
    password: {
        errorMessage: "The 'password' field is required and must be between 6 and 20 characters long.",
        trim: true,
        isLength: {
            options: { min: 6, max: 20 },
        },
        exists: true,
    },
    email: {
        errorMessage: "The 'email' field is required and must be a valid email address.",
        trim: true,
        isEmail: true,
        exists: true,
        custom: {
            options: (email) => __awaiter(void 0, void 0, void 0, function* () {
                let res = yield users_service_1.usersService.findUserByLoginOrEmail(email);
                if (res) {
                    return Promise.reject("The provided 'email' is already in use.");
                }
            }),
            errorMessage: "The provided 'email' is already in use.",
        },
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
exports.validateCreateUserData = (0, express_validator_1.checkSchema)(schema, [
    "body",
    "query",
    "params",
]);
