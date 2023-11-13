import request from "supertest";
import {app, Routes} from "../../src/app";
import {HTTP_STATUSES} from "../../src/http_statuses/http_statuses";
// @ts-ignore
import {blogsTestManager} from "../utils/blogs.test.manager";
import {BlogCreateModel} from "../../src/features/blogs/model/BlogCreateModel";

const authData = {
    user: 'admin',
    password: 'qwerty'
}

const noValidAuthData = {
    user: 'not valid user',
    password: 'qwerty'
}
describe('test for /blogs', () => {
    beforeAll(async () => {
        await request(app).delete(Routes.testing)
    })

    it('should return status 200 and empty', async () => {
        await request(app)
            .get(Routes.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('blog do not create because auth data is not valid', async () => {
        const data: BlogCreateModel = {websiteUrl: "", name: "Vlad", description: "desc"};
        await blogsTestManager.createBlog(data, noValidAuthData, HTTP_STATUSES.UNAUTHORIZED_401, {}
        )
    })

    it('blog do not create because url is not valid', async () => {
        const data: BlogCreateModel = {websiteUrl: "", name: "Vlad", description: "desc"};
        await blogsTestManager.createBlog(data, authData, HTTP_STATUSES.BAD_REQUEST_400, {
                "errorsMessages":
                    [
                        {
                            "field": "websiteUrl",
                            "message": "The 'websitUrl' field is required and must be no more than 100 characters.",
                        },
                    ],
            }
        )
    })


    it('blog do not create because name and description is not valid', async () => {
        const data: BlogCreateModel = {websiteUrl: "https://ekaterinburg.hh.ru/", name: "", description: ""};
        await blogsTestManager.createBlog(data, authData, HTTP_STATUSES.BAD_REQUEST_400, {
                "errorsMessages":
                    [
                        {
                            "field": "name",
                            "message": "The 'name' field is required and must be no more than 15 characters.",
                        },
                        {
                            "field": "description",
                            "message": "The 'description' field is required and must be no more than 500 characters.",
                        },
                    ],
            }
        )
    })


    let createdBlog: any = null

    it('blog should be created', async () => {
        const data: BlogCreateModel = {
            websiteUrl: "https://samurai.it-incubator.io",
            name: "Vlad",
            description: "desc"
        };
        const result = await blogsTestManager.createBlog(data, authData, HTTP_STATUSES.CREATED_201)
        createdBlog = result
    })

    it('blog must be found by id', async () => {
        await blogsTestManager.getBlogById(createdBlog.id, createdBlog.name)
    })

    it('blog should not be found by id', async () => {
        await blogsTestManager.getBlogById("id", "some name", HTTP_STATUSES.NOT_FOUND_404)
    })


    it('should return status 200 and array with one item', async () => {
       await request(app)
            .get(Routes.blogs)
            .expect(HTTP_STATUSES.OK_200, [createdBlog])
    })

    it('should not updated new blog with incorrect idEntity', async () => {
        await blogsTestManager.updateBlog('2', createdBlog, authData, HTTP_STATUSES.NOT_FOUND_404, {})
    })

    it('should not updated new blog with no valid authData', async () => {
        await blogsTestManager.updateBlog('2', createdBlog, noValidAuthData, HTTP_STATUSES.UNAUTHORIZED_401, {})
    })

    it('should not updated new blog with incorrect entity', async () => {
        await blogsTestManager.updateBlog(createdBlog.id, {name: ''}, authData, HTTP_STATUSES.BAD_REQUEST_400, {
            "errorsMessages": [
                {
                    "field": "name",
                    "message": "The 'title' field is required and must be no more than 15 characters.",
                },
                {
                    "field": "description",
                    "message": "The 'short description' field is required and must be no more than 100 characters.",
                },
                {
                    "field": "websiteUrl",
                    "message": "The 'websitUrl' field is required and must be no more than 100 characters.",
                },
            ],
        })
    })

    it('should be updated blog with correct data', async () => {
        await blogsTestManager.updateBlog(createdBlog.id, {
            name: 'Vlad',
            description: 'new blog',
            websiteUrl: 'https://www.google.com/'
        }, authData, HTTP_STATUSES.NO_CONTENT_204)
        let updatedBlog = await blogsTestManager.getBlogById(createdBlog.id, 'Vlad', HTTP_STATUSES.OK_200)
        expect(updatedBlog?.description).toEqual('new blog')
        expect(updatedBlog?.websiteUrl).toEqual('https://www.google.com/')
    })

    it('should not delete blog with incorrect auth data', async () => {
        await blogsTestManager.deleteBlog('2', noValidAuthData, HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('should not delete no existing blog', async () => {
        await blogsTestManager.deleteBlog('2', authData, HTTP_STATUSES.NOT_FOUND_404)
    })
    //
    it('should delete existing blog', async () => {
        await blogsTestManager.deleteBlog(createdBlog.id, authData, HTTP_STATUSES.NO_CONTENT_204)
    })
    it('should return status 200 and empty', async () => {
        await request(app)
            .get(Routes.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })
})