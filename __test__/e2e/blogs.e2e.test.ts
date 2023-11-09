import request from "supertest";
import {app, Routes} from "../../src/app";
import {HTTP_STATUSES} from "../../src/http_statuses/http_statuses";
import {blogsTestManager} from "../utils/blogs.test.manager";
import {BlogCreateModel} from "../../src/features/blogs/model/BlogCreateModel";

const authData ={
    user: 'admin',
    password: 'qwerty'
}
describe('test for /blogs', () => {
    beforeAll(async () => {
        await request(app).delete(Routes.testing)
    })

    it('should return status 200 and empty', async () => {
        await request(app)
            .get(Routes.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('blog do not create because auth data is not valid', async () => {
        const data: BlogCreateModel = {websiteUrl: "", name: "Vlad", description: "desc"};
        await blogsTestManager.createBlog(data, {
                user: 'not valid user',
                password: 'qwerty'
            }, HTTP_STATUSES.UNAUTHORIZED_401,{}
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

    it('blog should be created', async () => {
        const data: BlogCreateModel = {websiteUrl: "https://samurai.it-incubator.io", name: "Vlad", description: "desc"};
        await blogsTestManager.createBlog(data, authData, HTTP_STATUSES.CREATED_201, {
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


    // it('should return 404 for not existing video', async () => {
    //     await request(app)
    //         .get(`${Routes.videos}/333`)
    //         .expect(HTTP_STATUSES.NOT_FOUND_404)
    // })
    // //
    // it('should not added new video without correct data', async () => {
    //     const data = {title: ''};
    //     const response = await request(app)
    //         .post(Routes.videos)
    //         .send(data)
    //         .expect(HTTP_STATUSES.BAD_REQUEST_400, {
    //             "errorsMessages": [
    //                 {
    //                     "message": "no valid filed",
    //                     "field": "author"
    //                 },
    //                 {
    //                     "message": "no valid filed",
    //                     "field": "title"
    //                 }
    //             ]
    //         })
    // })
    //
    //
    // it('should not added new video without correct data', async () => {
    //     const data = {title: 'some title'};
    //     const response = await request(app)
    //         .post(Routes.videos)
    //         .send(data)
    //
    //         .expect(HTTP_STATUSES.BAD_REQUEST_400, {
    //             "errorsMessages": [
    //                 {
    //                     "message": "no valid filed",
    //                     "field": "autho" +
    //                         "" +
    //                         "r"
    //                 },
    //             ]
    //         })
    // })
    //
    let createdEntity1: any;
    //

    //
    // it('should return status 200 and array with one item', async () => {
    //     await request(app)
    //         .get(Routes.videos)
    //         .expect(HTTP_STATUSES.OK_200, [createdEntity1])
    // })
    //
    //
    // it("Should return a found entity by ID", async () => {
    //     const createResponse = await request(app)
    //         .get(`${Routes.videos}/${createdEntity1.id}`)
    //     expect(createResponse.body.title).toBe(createdEntity1.title)
    // })
    //
    // it('should not updated new video with incorrect data(body)', async () => {
    //     await request(app)
    //         .put(`${Routes.videos}/${createdEntity1.id}`)
    //         .send({title: 'newtitle'})
    //         .expect(HTTP_STATUSES.BAD_REQUEST_400, {
    //             "errorsMessages": [
    //                 {
    //                     "message": "no valid filed",
    //                     "field": "author"
    //                 }
    //             ]
    //         })
    // })
    //
    //
    // it('should not updated new video with incorrect data(body)', async () => {
    //     await request(app)
    //         .put(`${Routes.videos}/${createdEntity1.id}`)
    //         .send({})
    //         .expect(HTTP_STATUSES.BAD_REQUEST_400, {
    //                 errorsMessages: [
    //                     {message: 'no valid filed', field: 'author'},
    //                     {message: 'no valid filed', field: 'title'}
    //                 ]
    //             }
    //         )
    // })
    //
    // it('video should be updated', async () => {
    //
    //     let dateForTesting = new Date().toISOString()
    //
    //     const data: VideoUpdateModel = {
    //         title: 'new title!!!',
    //         canBeDownloaded: true,
    //         author: "Super Vlad",
    //         publicationDate: dateForTesting,
    //         minAgeRestriction: 10,
    //         availableResolutions: ["P360", "P480", "P720"]
    //     };
    //     const createResponse = await request(app)
    //         .put(`${Routes.videos}/${createdEntity1.id}`)
    //         .send(data)
    //         .expect(HTTP_STATUSES.NO_CONTENT_204)
    //
    //     let updatedEntity = await request(app).get(`${Routes.videos}/${createdEntity1.id}`)
    //     expect(updatedEntity.body.title).toBe('new title!!!')
    //     expect(updatedEntity.body.canBeDownloaded).toBeTruthy()
    //     expect(updatedEntity.body.author).toBe("Super Vlad")
    //     expect(updatedEntity.body.publicationDate).toBe(dateForTesting)
    //     expect(updatedEntity.body.minAgeRestriction).toBe(10)
    //     expect(updatedEntity.body.availableResolutions).toEqual(["P360", "P480", "P720"])
    // })
    //
    //
    // it('should return status 200 and one items', async () => {
    //     const response = await request(app)
    //         .get(Routes.videos)
    //         .expect(HTTP_STATUSES.OK_200)
    //     expect(response.body.length === 1)
    // })
    //
    // it('should not delete no existing video', async () => {
    //     const response = await request(app)
    //         .delete(`${Routes.videos}/3`)
    //         .expect(HTTP_STATUSES.NOT_FOUND_404)
    // })
    //
    // it('should delete existing video', async () => {
    //     const response = await request(app)
    //         .delete(`${Routes.videos}/${createdEntity1.id}`)
    //         .expect(HTTP_STATUSES.NO_CONTENT_204)
    // })
    //
    //
    // it('all courses should be deleted', async () => {
    //     await request(app)
    //         .get(Routes.videos)
    //         .expect(HTTP_STATUSES.OK_200, [])
    // })

})