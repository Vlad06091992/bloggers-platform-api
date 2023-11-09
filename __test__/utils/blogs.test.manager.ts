import {HTTP_STATUSES} from "../../src/http_statuses/http_statuses";
import request from "supertest";
import {app, Routes} from "../../src/app";
import {BlogType, ErrorResponseType} from "../../src/types";


export const blogsTestManager = {
    async createBlog(data: any, {user, password}: {
        user: string,
        password: string
    }, HTTPStatus = HTTP_STATUSES.CREATED_201, errorsObject?: ErrorResponseType | {}) {
        const response = await request(app)
            .post(Routes.blogs)
            .auth(user, password)
            .send(data)
        if (HTTPStatus === HTTP_STATUSES.CREATED_201) {
            const {id, ...responseBodyWithoutId} = response.body
            expect(responseBodyWithoutId).toEqual(data)
            return response.body
        } else {
            expect(response.status).toEqual(HTTPStatus)
            expect(response.body).toEqual(errorsObject)
        }
    },
    async getBlogById(id: string,name:string, HTTPStatus = HTTP_STATUSES.OK_200): Promise<BlogType | undefined> {
        const response = await request(app)
            .get(`${Routes.blogs}/${id}`)
        if (HTTPStatus === HTTP_STATUSES.OK_200) {
            expect(response.body.name).toEqual(name)
            return response.body
        } else {
            expect(response.status).toEqual(HTTPStatus)
        }
    }
}