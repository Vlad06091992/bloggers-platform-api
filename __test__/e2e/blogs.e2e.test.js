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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
const http_statuses_1 = require("../../src/http_statuses/http_statuses");
// @ts-ignore
const blogs_test_manager_1 = require("../utils/blogs.test.manager");
const authData = {
    user: "admin",
    password: "qwerty",
};
const noValidAuthData = {
    user: "not valid user",
    password: "qwerty",
};
describe("test for /blogs", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete(app_1.Routes.testing);
    }));
    it("should return status 200 and empty", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).get(app_1.Routes.blogs).expect(http_statuses_1.HTTP_STATUSES.OK_200, []);
    }));
    it("blog do not create because auth data is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            websiteUrl: "",
            name: "Vlad",
            description: "desc",
        };
        yield blogs_test_manager_1.blogsTestManager.createBlog(data, noValidAuthData, http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401, {});
    }));
    it("blog do not create because url is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            websiteUrl: "",
            name: "Vlad",
            description: "desc",
        };
        yield blogs_test_manager_1.blogsTestManager.createBlog(data, authData, http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400, {
            errorsMessages: [
                {
                    field: "websiteUrl",
                    message: "The 'websitUrl' field is required and must be no more than 100 characters.",
                },
            ],
        });
    }));
    it("blog do not create because name and description is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            websiteUrl: "https://ekaterinburg.hh.ru/",
            name: "",
            description: "",
        };
        yield blogs_test_manager_1.blogsTestManager.createBlog(data, authData, http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400, {
            errorsMessages: [
                {
                    field: "name",
                    message: "The 'name' field is required and must be no more than 15 characters.",
                },
                {
                    field: "description",
                    message: "The 'description' field is required and must be no more than 500 characters.",
                },
            ],
        });
    }));
    let createdBlog = null;
    it("blog should be created", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            websiteUrl: "https://samurai.it-incubator.io",
            name: "Vlad",
            description: "desc",
        };
        const result = yield blogs_test_manager_1.blogsTestManager.createBlog(data, authData, http_statuses_1.HTTP_STATUSES.CREATED_201);
        createdBlog = result;
    }));
    it("blog must be found by id", () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogs_test_manager_1.blogsTestManager.getBlogById(createdBlog.id, createdBlog.name);
    }));
    it("blog should not be found by id", () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogs_test_manager_1.blogsTestManager.getBlogById("id", "some name", http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it("should return status 200 and array with one item", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(app_1.Routes.blogs)
            .expect(http_statuses_1.HTTP_STATUSES.OK_200, [createdBlog]);
    }));
    it("should not updated new blog with incorrect idEntity", () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogs_test_manager_1.blogsTestManager.updateBlog("2", createdBlog, authData, http_statuses_1.HTTP_STATUSES.NOT_FOUND_404, {});
    }));
    it("should not updated new blog with no valid authData", () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogs_test_manager_1.blogsTestManager.updateBlog("2", createdBlog, noValidAuthData, http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401, {});
    }));
    it("should not updated new blog with incorrect entity", () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogs_test_manager_1.blogsTestManager.updateBlog(createdBlog.id, { name: "" }, authData, http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400, {
            errorsMessages: [
                {
                    field: "name",
                    message: "The 'title' field is required and must be no more than 15 characters.",
                },
                {
                    field: "description",
                    message: "The 'short description' field is required and must be no more than 100 characters.",
                },
                {
                    field: "websiteUrl",
                    message: "The 'websitUrl' field is required and must be no more than 100 characters.",
                },
            ],
        });
    }));
    it("should be updated blog with correct data", () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogs_test_manager_1.blogsTestManager.updateBlog(createdBlog.id, {
            name: "Vlad",
            description: "new blog",
            websiteUrl: "https://www.google.com/",
        }, authData, http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        let updatedBlog = yield blogs_test_manager_1.blogsTestManager.getBlogById(createdBlog.id, "Vlad", http_statuses_1.HTTP_STATUSES.OK_200);
        expect(updatedBlog === null || updatedBlog === void 0 ? void 0 : updatedBlog.description).toEqual("new blog");
        expect(updatedBlog === null || updatedBlog === void 0 ? void 0 : updatedBlog.websiteUrl).toEqual("https://www.google.com/");
    }));
    it("should not delete blog with incorrect auth data", () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogs_test_manager_1.blogsTestManager.deleteBlog("2", noValidAuthData, http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
    }));
    it("should not delete no existing blog", () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogs_test_manager_1.blogsTestManager.deleteBlog("2", authData, http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    //
    it("should delete existing blog", () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogs_test_manager_1.blogsTestManager.deleteBlog(createdBlog.id, authData, http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
    }));
    it("should return status 200 and empty", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).get(app_1.Routes.blogs).expect(http_statuses_1.HTTP_STATUSES.OK_200, []);
    }));
});
