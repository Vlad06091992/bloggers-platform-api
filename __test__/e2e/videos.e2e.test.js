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
describe('test for /courses', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete(app_1.Routes.testing);
    }));
    it('should return status 200 and empty', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(app_1.Routes.videos)
            .expect(http_statuses_1.HTTP_STATUSES.OK_200, []);
    }));
    // it('should return 404 for not existing course', async () => {
    //     await request(app)
    //         .get(`${Routes.courses}/333`)
    //         .expect(HTTP_STATUSES.NOT_FOUND_404)
    // })
    //
    // it('should not added new course without correct data', async () => {
    //     const data = {title: '', studentsCount: 0};
    //     const {response, createdEntity} = await courseTestManager.createCourse(data, HTTP_STATUSES.BAD_REQUEST_400)
    // })
    //
    // it('should return status 200 and empty', async () => {
    //     await request(app)
    //         .get(Routes.courses)
    //         .expect(HTTP_STATUSES.OK_200, [])
    // })
    //
    // let createdCourse1: any = null
    //
    // it('should added new course(vue)', async () => {
    //     const data: CourseCreateModel = {title: 'vue', studentsCount: 0};
    //     const {response, createdEntity} = await courseTestManager.createCourse(data)
    //     createdCourse1 = createdEntity
    //     await request(app).get(Routes.courses).expect(HTTP_STATUSES.OK_200, [createdCourse1])
    // })
    //
    // it("Should return a found entity by ID", async () => {
    //     const createResponse = await request(app)
    //         .get(`${Routes.courses}/${createdCourse1.id}`)
    //     expect(createResponse.body.title).toBe('vue')
    // })
    //
    // it('should not updated new course with incorrect data', async () => {
    //     await request(app)
    //         .put(`${Routes.courses}/35`)
    //         .send({title: 'newtitle'})
    //     expect(HTTP_STATUSES.BAD_REQUEST_400)
    // })
    //
    // it('course should be updated', async () => {
    //     const data: CourseUpdateModel = {title: 'vue composition API', studentsCount: 0};
    //     const createResponse = await request(app)
    //         .put(`${Routes.courses}/${createdCourse1.id}`)
    //         .send(data)
    //     expect(HTTP_STATUSES.CREATED_201)
    //     expect(createResponse.body).toEqual({id: expect.any(Number), title: 'vue composition API'})
    // })
    //
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
