import { HTTP_STATUSES } from "../../src/http_statuses/http_statuses";
import request from "supertest";
import { app, Routes } from "../../src/app";
import { ErrorResponseType } from "../../src/types";
import { PostViewModel } from "../../src/features/posts/model/PostViewModel";

type AuthDataType = {
  user: string;
  password: string;
};

export const postsTestManager = {
  async createPost(
    data: any,
    blogName: string,
    { user, password }: AuthDataType,
    HTTPStatus = HTTP_STATUSES.CREATED_201,
    errorsObject?: ErrorResponseType | {},
  ): Promise<PostViewModel | ErrorResponseType> {
    const response = await request(app)
      .post(Routes.posts)
      .auth(user, password)
      .send(data);
    expect(response.status).toEqual(HTTPStatus);
    if (HTTPStatus === HTTP_STATUSES.CREATED_201) {
      expect(response.body).toEqual({
        ...data,
        blogName,
        id: expect.any(String),
        createdAt: expect.any(String),
      });
      return response.body;
    } else {
      expect(response.body).toEqual(errorsObject);
      return response.body;
    }
  },
  async getPostById(
    id: string,
    title: string,
    HTTPStatus = HTTP_STATUSES.OK_200,
  ): Promise<PostViewModel | undefined> {
    const response = await request(app).get(`${Routes.posts}/${id}`);
    if (HTTPStatus === HTTP_STATUSES.OK_200) {
      expect(response.body.title).toEqual(title);
      return response.body;
    } else {
      expect(response.status).toEqual(HTTPStatus);
    }
  },
  async updatePost(
    id: string,
    data: any,
    { user, password }: AuthDataType,
    HTTPStatus = HTTP_STATUSES.CREATED_201,
    errorsObject?: ErrorResponseType | {},
  ): Promise<void | ErrorResponseType> {
    const response = await request(app)
      .put(`${Routes.posts}/${id}`)
      .auth(user, password)
      .send(data);
    if (HTTPStatus === HTTP_STATUSES.NO_CONTENT_204) {
      expect(response.status).toEqual(HTTPStatus);
    } else {
      expect(response.status).toEqual(HTTPStatus);
      expect(response.body).toEqual(errorsObject);
      return response.body;
    }
  },
  async deletePost(
    id: string,
    { user, password }: AuthDataType,
    HTTPStatus = HTTP_STATUSES.NO_CONTENT_204,
  ): Promise<void> {
    const response = await request(app)
      .delete(`${Routes.posts}/${id}`)
      .auth(user, password)
      .expect(HTTPStatus);
  },
};
