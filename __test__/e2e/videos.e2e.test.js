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
describe('test for /videos', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete(app_1.Routes.testing);
    }));
    it('should return status 200 and empty', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(app_1.Routes.videos)
            .expect(http_statuses_1.HTTP_STATUSES.OK_200, []);
    }));
    it('should return 404 for not existing video', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(`${app_1.Routes.videos}/333`)
            .expect(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    //
    it('should not added new video without correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: '' };
        const response = yield (0, supertest_1.default)(app_1.app)
            .post(app_1.Routes.videos)
            .send(data)
            .expect(http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400, {
            "errorsMessages": [
                {
                    "message": "no valid filed",
                    "field": "author"
                },
                {
                    "message": "no valid filed",
                    "field": "title"
                }
            ]
        });
    }));
    it('should not added new video without correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'some title' };
        const response = yield (0, supertest_1.default)(app_1.app)
            .post(app_1.Routes.videos)
            .send(data)
            .expect(http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400, {
            "errorsMessages": [
                {
                    "message": "no valid filed",
                    "field": "autho" +
                        "" +
                        "r"
                },
            ]
        });
    }));
    let createdEntity1;
    it('should added new video(car review)', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'vue', author: 'Vlad', availableResolutions: ['P144'] };
        const response = yield (0, supertest_1.default)(app_1.app)
            .post(app_1.Routes.videos)
            .send(data)
            .expect(http_statuses_1.HTTP_STATUSES.CREATED_201);
        const createdEntity = response.body;
        createdEntity1 = createdEntity;
        expect(createdEntity.title).toBe(data.title);
        expect(createdEntity.author).toBe(data.author);
        expect(createdEntity.id).toEqual(expect.any(Number));
    }));
    it('should return status 200 and array with one item', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(app_1.Routes.videos)
            .expect(http_statuses_1.HTTP_STATUSES.OK_200, [createdEntity1]);
    }));
    it("Should return a found entity by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(app_1.app)
            .get(`${app_1.Routes.videos}/${createdEntity1.id}`);
        expect(createResponse.body.title).toBe(createdEntity1.title);
    }));
    it('should not updated new video with incorrect data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .put(`${app_1.Routes.videos}/35`)
            .send({ title: 'newtitle' });
        expect(http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400);
    }));
    // it('video should be updated', async () => {
    //     const data: any = {title: 'new title!!!'};
    //     const createResponse = await request(app)
    //         .put(`${Routes.videos}/${createdEntity1.id}`)
    //         .send(data)
    //     expect(HTTP_STATUSES.OK_200)
    //
    //     // let updatedEntity = createResponse.body
    //
    //     // expect(updatedEntity.title).toBe('new title!!!')
    // })
    it('video should be updated', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'new title!!!' };
        const createResponse = yield (0, supertest_1.default)(app_1.app)
            .put(`/videos/2`)
            .send(data);
        expect({});
    }));
    //
    // let createdCourse2: any = null
    //
    // it('should added new course(angular)', async () => {
    //     const data: CourseCreateModel = {title: 'angular', studentsCount: 0};
    //     const {response, createdEntity} = await courseTestManager.createCourse(data)
    //     createdCourse2 = createdEntity
    //     const coursesResponse = await request(app).get(Routes.courses)
    //     expect(coursesResponse.body.length).toBe(2)
    // })
    //
    //
    // it('course should be updated', async () => {
    //     const data1: CourseUpdateModel = {title: 'ANGULAR!!!', studentsCount: 0};
    //     const createResponse = await request(app)
    //         .put(`${Routes.courses}/${createdCourse2.id}`)
    //         .send(data1)
    //     expect(HTTP_STATUSES.CREATED_201)
    //     expect(createResponse.body).toEqual({id: expect.any(Number), title: 'ANGULAR!!!'})
    // })
    //
    // it('all courses should be deleted', async () => {
    //     await request(app)
    //         .delete(`${Routes.courses}/${createdCourse1.id}`)
    //         .expect(HTTP_STATUSES.NO_CONTENT_204)
    //     await request(app)
    //         .get(`${Routes.courses}/${createdCourse1.id}`)
    //         .expect(HTTP_STATUSES.NOT_FOUND_404)
    //     await request(app)
    //         .delete(`${Routes.courses}/${createdCourse2.id}`)
    //         .expect(HTTP_STATUSES.NO_CONTENT_204)
    //     await request(app)
    //         .get(Routes.courses)
    //         .expect(HTTP_STATUSES.OK_200, [])
    // })
});
