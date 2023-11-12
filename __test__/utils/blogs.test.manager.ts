import {HTTP_STATUSES} from "../../src/http_statuses/http_statuses";
import request from "supertest";
import {app, Routes} from "../../src/app";
import {BlogType, ErrorResponseType} from "../../src/types";

type AuthDataType = {
    user: string,
    password: string
}

export const blogsTestManager = {
    async createBlog(data: any, {user, password}: AuthDataType, HTTPStatus = HTTP_STATUSES.CREATED_201, errorsObject?: ErrorResponseType | {}): Promise<BlogType | ErrorResponseType> {
        const response = await request(app)
            .post(Routes.blogs)
            .auth(user, password)
            .send(data)

        expect(response.status).toEqual(HTTPStatus)

        if (HTTPStatus === HTTP_STATUSES.CREATED_201) {
            const {id, ...responseBodyWithoutId} = response.body
            expect(responseBodyWithoutId).toEqual(data)
            return response.body
        } else {
            expect(response.body).toEqual(errorsObject)
            return response.body
        }
    },
    async getBlogById(id: string, name: string, HTTPStatus = HTTP_STATUSES.OK_200): Promise<BlogType | undefined> {
        const response = await request(app)
            .get(`${Routes.blogs}/${id}`)
        if (HTTPStatus === HTTP_STATUSES.OK_200) {
            expect(response.body.name).toEqual(name)
            return response.body
        } else {
            expect(response.status).toEqual(HTTPStatus)
        }
    },
    async updateBlog(id:string,data: any, {user, password}: AuthDataType, HTTPStatus = HTTP_STATUSES.CREATED_201, errorsObject?: ErrorResponseType | {}): Promise<void | ErrorResponseType> {
        const response = await request(app)
            .put(`${Routes.blogs}/${id}`)
            .auth(user, password)
            .send(data)
        if (HTTPStatus === HTTP_STATUSES.NO_CONTENT_204) {
           expect(response.status).toEqual(HTTPStatus)
        } else {
            expect(response.status).toEqual(HTTPStatus)
            expect(response.body).toEqual(errorsObject)
            return response.body
        }
    },
    async deleteBlog(id: string,{user, password}: AuthDataType, HTTPStatus = HTTP_STATUSES.NO_CONTENT_204): Promise<void> {
        const response = await request(app)
            .delete(`${Routes.blogs}/${id}`)
            .auth(user, password)
            .expect(HTTPStatus)
    },
}