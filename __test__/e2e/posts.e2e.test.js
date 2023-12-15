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
// @ts-ignore
const posts_tests_manager_1 = require("../utils/posts.tests.manager");
const authData = {
    user: 'admin',
    password: 'qwerty'
};
const noValidAuthData = {
    user: 'not valid user',
    password: 'qwerty'
};
describe('test for /posts', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete(app_1.Routes.testing);
    }));
    it('should return status 200 and empty', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(app_1.Routes.videos)
            .expect(http_statuses_1.HTTP_STATUSES.OK_200, []);
    }));
    it('post do not create because auth data is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'new title', blogId: '1', content: 'content', shortDescription: 'desc' };
        yield posts_tests_manager_1.postsTestManager.createPost(data, '', noValidAuthData, http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401, {});
    }));
    it('post do not create because title is not valid and blog not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: '', blogId: '1', content: 'content', shortDescription: 'desc' };
        yield posts_tests_manager_1.postsTestManager.createPost(data, '', authData, http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400, {
            "errorsMessages": [
                {
                    "field": "title",
                    "message": "The 'title' field is required and must be no more than 15 characters.",
                },
                {
                    "field": "blogId",
                    "message": "blog is not found",
                },
            ],
        });
    }));
    it('post do not create because content and shortDescription is not valid and blog is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'new title', blogId: '1', content: '', shortDescription: '' };
        yield posts_tests_manager_1.postsTestManager.createPost(data, '', authData, http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400, {
            "errorsMessages": [
                {
                    "field": "shortDescription",
                    "message": "The 'short description' field is required and must be no more than 500 characters.",
                },
                {
                    "field": "content",
                    "message": "The 'websiteUrl' field is required and must be no more than 100 characters.",
                },
                {
                    "field": "blogId",
                    "message": "blog is not found",
                },
            ],
        });
    }));
    let createdPost = null;
    let createdBlog = null;
    it('post should be created', () => __awaiter(void 0, void 0, void 0, function* () {
        const blogName = 'New blog';
        debugger;
        createdBlog = (yield blogs_test_manager_1.blogsTestManager.createBlog({
            websiteUrl: "https://samurai.it-incubator.io",
            name: blogName,
            description: "desc"
        }, authData));
        const data = {
            title: 'new title',
            blogId: createdBlog.id,
            content: 'content',
            shortDescription: 'short description'
        };
        const result = yield posts_tests_manager_1.postsTestManager.createPost(data, blogName, authData, http_statuses_1.HTTP_STATUSES.CREATED_201, {});
        createdPost = result;
    }));
    it('post must be found by id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield posts_tests_manager_1.postsTestManager.getPostById(createdPost.id, createdPost.title);
    }));
    it('post should not found by id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield posts_tests_manager_1.postsTestManager.getPostById("2", 'some title', http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should return status 200 and array with one item', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(app_1.Routes.posts)
            .expect(http_statuses_1.HTTP_STATUSES.OK_200, [createdPost]);
    }));
    it('should not updated new post with incorrect idEntity', () => __awaiter(void 0, void 0, void 0, function* () {
        yield posts_tests_manager_1.postsTestManager.updatePost('2', createdPost, authData, http_statuses_1.HTTP_STATUSES.NOT_FOUND_404, {});
    }));
    it('should not updated new post with no valid authData', () => __awaiter(void 0, void 0, void 0, function* () {
        yield posts_tests_manager_1.postsTestManager.updatePost('2', createdPost, noValidAuthData, http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401, {});
    }));
    it('post do not updated because title,content is not valid and blog is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield posts_tests_manager_1.postsTestManager.updatePost(createdPost.id, {
            title: 'new title',
            blogId: '1',
            content: '',
            shortDescription: ''
        }, authData, http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400, {
            "errorsMessages": [
                {
                    "field": "shortDescription",
                    "message": "The 'short description' field is required and must be no more than 500 characters."
                },
                {
                    "field": "content",
                    "message": "The 'websiteUrl' field is required and must be no more than 100 characters.",
                },
                {
                    "field": "blogId",
                    "message": "blog is not found",
                },
            ],
        });
    }));
    it('should be updated post with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield posts_tests_manager_1.postsTestManager.updatePost(createdPost.id, {
            title: 'new title',
            blogId: createdBlog.id,
            content: 'content',
            shortDescription: 'shortDescription'
        }, authData, http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        let updatedPost = yield posts_tests_manager_1.postsTestManager.getPostById(createdPost.id, createdPost.title, http_statuses_1.HTTP_STATUSES.OK_200);
        expect(updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.shortDescription).toEqual('shortDescription');
        expect(updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.content).toEqual('content');
    }));
    it('should not delete post with incorrect auth data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield posts_tests_manager_1.postsTestManager.deletePost(createdPost.id, noValidAuthData, http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
    }));
    it('should not delete no existing post', () => __awaiter(void 0, void 0, void 0, function* () {
        yield posts_tests_manager_1.postsTestManager.deletePost('2', authData, http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    //
    it('should delete existing post', () => __awaiter(void 0, void 0, void 0, function* () {
        yield posts_tests_manager_1.postsTestManager.deletePost(createdPost.id, authData, http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
    }));
    it('should return status 200 and empty', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(app_1.Routes.posts)
            .expect(http_statuses_1.HTTP_STATUSES.OK_200, []);
    }));
});
