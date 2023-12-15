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
exports.blogsTestManager = void 0;
const http_statuses_1 = require("../../src/http_statuses/http_statuses");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
exports.blogsTestManager = {
    createBlog(data, { user, password }, HTTPStatus = http_statuses_1.HTTP_STATUSES.CREATED_201, errorsObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post(app_1.Routes.blogs)
                .auth(user, password)
                .send(data);
            expect(response.status).toEqual(HTTPStatus);
            if (HTTPStatus === http_statuses_1.HTTP_STATUSES.CREATED_201) {
                expect(response.body).toEqual(Object.assign(Object.assign({}, data), { isMembership: false, id: expect.any(String), createdAt: expect.any(String) }));
                return response.body;
            }
            else {
                expect(response.body).toEqual(errorsObject);
                return response.body;
            }
        });
    },
    getBlogById(id, name, HTTPStatus = http_statuses_1.HTTP_STATUSES.OK_200) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .get(`${app_1.Routes.blogs}/${id}`);
            if (HTTPStatus === http_statuses_1.HTTP_STATUSES.OK_200) {
                expect(response.body.name).toEqual(name);
                return response.body;
            }
            else {
                expect(response.status).toEqual(HTTPStatus);
            }
        });
    },
    updateBlog(id, data, { user, password }, HTTPStatus = http_statuses_1.HTTP_STATUSES.CREATED_201, errorsObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .put(`${app_1.Routes.blogs}/${id}`)
                .auth(user, password)
                .send(data);
            if (HTTPStatus === http_statuses_1.HTTP_STATUSES.NO_CONTENT_204) {
                expect(response.status).toEqual(HTTPStatus);
            }
            else {
                expect(response.status).toEqual(HTTPStatus);
                expect(response.body).toEqual(errorsObject);
                return response.body;
            }
        });
    },
    deleteBlog(id, { user, password }, HTTPStatus = http_statuses_1.HTTP_STATUSES.NO_CONTENT_204) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .delete(`${app_1.Routes.blogs}/${id}`)
                .auth(user, password)
                .expect(HTTPStatus);
        });
    },
};
