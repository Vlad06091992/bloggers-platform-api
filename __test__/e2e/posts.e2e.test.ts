import request from "supertest";
import { app, Routes } from "../../src/app";
import { HTTP_STATUSES } from "../../src/http_statuses/http_statuses";
// @ts-ignore
import { blogsTestManager } from "../utils/blogs.test.manager";
// @ts-ignore
import { postsTestManager } from "../utils/posts.tests.manager";
import { PostCreateModel } from "../../src/features/posts/types/types";
import { BlogViewModel } from "../../src/features/blogs/types/types";

const authData = {
  user: "admin",
  password: "qwerty",
};

const noValidAuthData = {
  user: "not valid user",
  password: "qwerty",
};
describe("test for /posts", () => {
  beforeAll(async () => {
    await request(app).delete(Routes.testing);
  });

  it("should return status 200 and empty", async () => {
    await request(app).get(Routes.videos).expect(HTTP_STATUSES.OK_200, []);
  });

  it("post do not create because auth data is not valid", async () => {
    const data: PostCreateModel = {
      title: "new title",
      blogId: "1",
      content: "content",
      shortDescription: "desc",
    };
    await postsTestManager.createPost(
      data,
      "",
      noValidAuthData,
      HTTP_STATUSES.UNAUTHORIZED_401,
      {},
    );
  });

  it("post do not create because title is not valid and blog not found", async () => {
    const data: PostCreateModel = {
      title: "",
      blogId: "1",
      content: "content",
      shortDescription: "desc",
    };
    await postsTestManager.createPost(
      data,
      "",
      authData,
      HTTP_STATUSES.BAD_REQUEST_400,
      {
        errorsMessages: [
          {
            field: "title",
            message:
              "The 'title' field is required and must be no more than 15 characters.",
          },
          {
            field: "blogId",
            message: "blog is not found",
          },
        ],
      },
    );
  });

  it("post do not create because content and shortDescription is not valid and blog is not found", async () => {
    const data: PostCreateModel = {
      title: "new title",
      blogId: "1",
      content: "",
      shortDescription: "",
    };
    await postsTestManager.createPost(
      data,
      "",
      authData,
      HTTP_STATUSES.BAD_REQUEST_400,
      {
        errorsMessages: [
          {
            field: "shortDescription",
            message:
              "The 'short description' field is required and must be no more than 500 characters.",
          },
          {
            field: "content",
            message:
              "The 'websiteUrl' field is required and must be no more than 100 characters.",
          },
          {
            field: "blogId",
            message: "blog is not found",
          },
        ],
      },
    );
  });

  let createdPost: any = null;
  let createdBlog: any = null;
  it("post should be created", async () => {
    const blogName = "New blog";
    debugger;
    createdBlog = (await blogsTestManager.createBlog(
      {
        websiteUrl: "https://samurai.it-incubator.io",
        name: blogName,
        description: "desc",
      },
      authData,
    )) as BlogViewModel;
    const data: PostCreateModel = {
      title: "new title",
      blogId: createdBlog.id,
      content: "content",
      shortDescription: "short description",
    };
    const result = await postsTestManager.createPost(
      data,
      blogName,
      authData,
      HTTP_STATUSES.CREATED_201,
      {},
    );
    createdPost = result;
  });

  it("post must be found by id", async () => {
    await postsTestManager.getPostById(createdPost.id, createdPost.title);
  });

  it("post should not found by id", async () => {
    await postsTestManager.getPostById(
      "2",
      "some title",
      HTTP_STATUSES.NOT_FOUND_404,
    );
  });

  it("should return status 200 and array with one item", async () => {
    await request(app)
      .get(Routes.posts)
      .expect(HTTP_STATUSES.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [createdPost]
      });
  });

  it("should not updated new post with incorrect idEntity", async () => {
    await postsTestManager.updatePost(
      "2",
      createdPost,
      authData,
      HTTP_STATUSES.NOT_FOUND_404,
      {},
    );
  });

  it("should not updated new post with no valid authData", async () => {
    await postsTestManager.updatePost(
      "2",
      createdPost,
      noValidAuthData,
      HTTP_STATUSES.UNAUTHORIZED_401,
      {},
    );
  });

  it("post do not updated because title,content is not valid and blog is not found", async () => {
    await postsTestManager.updatePost(
      createdPost.id,
      {
        title: "new title",
        blogId: "1",
        content: "",
        shortDescription: "",
      },
      authData,
      HTTP_STATUSES.BAD_REQUEST_400,
      {
        errorsMessages: [
          {
            field: "shortDescription",
            message:
              "The 'short description' field is required and must be no more than 500 characters.",
          },
          {
            field: "content",
            message:
              "The 'websiteUrl' field is required and must be no more than 100 characters.",
          },
          {
            field: "blogId",
            message: "blog is not found",
          },
        ],
      },
    );
  });

  it("should be updated post with correct data", async () => {
    await postsTestManager.updatePost(
      createdPost.id,
      {
        title: "new title",
        blogId: createdBlog.id,
        content: "content",
        shortDescription: "shortDescription",
      },
      authData,
      HTTP_STATUSES.NO_CONTENT_204,
    );
    let updatedPost = await postsTestManager.getPostById(
      createdPost.id,
      createdPost.title,
      HTTP_STATUSES.OK_200,
    );
    expect(updatedPost?.shortDescription).toEqual("shortDescription");
    expect(updatedPost?.content).toEqual("content");
  });

  it("should not delete post with incorrect auth data", async () => {
    await postsTestManager.deletePost(
      createdPost.id,
      noValidAuthData,
      HTTP_STATUSES.UNAUTHORIZED_401,
    );
  });

  it("should not delete no existing post", async () => {
    await postsTestManager.deletePost(
      "2",
      authData,
      HTTP_STATUSES.NOT_FOUND_404,
    );
  });
  //
  it("should delete existing post", async () => {
    await postsTestManager.deletePost(
      createdPost.id,
      authData,
      HTTP_STATUSES.NO_CONTENT_204,
    );
  });
  it("should return status 200 and empty", async () => {
    await request(app).get(Routes.posts).expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
  });
});
