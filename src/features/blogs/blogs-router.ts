import express from "express";

import {validateCreateBlogData} from "./validators/validateCreateBlogData";
import {validateUpdateBlogData} from "./validators/validateUpdateBlogData";
import {validateErrors} from "../../middlewares/validateErrors";
import {isExistingBlog} from "../../middlewares/isExistingBlog";
import {validateCreatePostData} from "../posts/validators/validateCreatePostData";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {blogsController} from "../../features/blogs/composition-blogs";




export const getBlogsRouter = () => {
    const router = express.Router();
    router.get(
        "/",
        blogsController.getBlogs.bind(blogsController)
    );

    router.post(
        "/",
        authMiddleware,
        validateCreateBlogData,
        validateErrors,
        blogsController.createBlog.bind(blogsController)
    );

    router.get(
        "/:id",
        blogsController.getBlog.bind(blogsController)
    );

    router.put(
        "/:id",
        authMiddleware,
        validateUpdateBlogData,
        validateErrors,
        blogsController.updateBlog.bind(blogsController)
    );

    router.delete(
        "/:id",
        authMiddleware,
        blogsController.deleteBlog.bind(blogsController)
    );

    router.post(
        "/:id/posts",
        authMiddleware,
        isExistingBlog,
        validateCreatePostData,
        validateErrors,
        blogsController.createPostForBlog.bind(blogsController)
    );

    router.get(
        "/:id/posts",
        isExistingBlog,
        blogsController.findPostsForSpecificBlog.bind(blogsController)
    );
    return router;
};




