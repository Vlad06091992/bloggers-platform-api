import express, { Response } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../../types";
import {validateCreateUserData} from "./validators/validateCreateUserData";
import {usersService} from "../users/users-service";
import {HTTP_STATUSES} from "../../../src/http_statuses/http_statuses";
import {validateErrors} from "../../middlewares/validateErrors";
import {UserCreateModel, UserViewModel} from "./types/types";


export const getPostsRouter = () => {
  const router = express.Router();
  // router.get(
  //   "/",
  //   async (
  //     req: RequestWithQuery<QueryPostModel>,
  //     res: Response<ResponsePostsModel>,
  //   ) => {
  //     let foundedPosts:ResponsePostsModel = await usersRepository.findPosts(req.query);
  //     res.status(HTTP_STATUSES.OK_200).send(foundedPosts);
  //   },
  // );

  router.post(
    "/",
    validateCreateUserData,
    validateErrors,
    async (
      req: RequestWithBody<UserCreateModel>,
      res: Response<UserViewModel>,
    ) => {
      let newUser = await usersService.createPost(req.body);
      res.status(HTTP_STATUSES.CREATED_201).send(newUser);
    },
  );

  // router.get(
  //   "/:id",
  //   async (
  //     req: RequestWithParams<URIParamsPostIdModel>,
  //     res: Response<UserViewModel | number>,
  //   ) => {
  //     const post = await usersService.getPostById(req.params.id);
  //     if (post) {
  //       res.send(post);
  //     } else {
  //       res.send(HTTP_STATUSES.NOT_FOUND_404);
  //     }
  //   },
  // );
  //
  // router.put(
  //   "/:id",
  //   authMiddleware,
  //   validateCreatePostDataWithIdParams,
  //   validateErrors,
  //   async (
  //     req: RequestWithParamsAndBody<URIParamsPostIdModel, PostUpdateModel>,
  //     res: Response<PostViewModel | number>,
  //   ) => {
  //     const isExistsPost = await usersService.getPostById(req.params.id);
  //     if (!isExistsPost) {
  //       res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  //       return;
  //     }
  //     await usersRepository.updatePost(req.params.id, req.body);
  //     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  //   },
  // );

  // router.delete(
  //   "/:id",
  //   authMiddleware,
  //   async (
  //     req: RequestWithParams<URIParamsPostIdModel>,
  //     res: Response<number>,
  //   ) => {
  //     const isDeleted = await usersService.deletePost(req.params.id);
  //     if (isDeleted) {
  //       res.send(HTTP_STATUSES.NO_CONTENT_204);
  //     } else {
  //       res.send(HTTP_STATUSES.NOT_FOUND_404);
  //     }
  //   },
  // );
  return router;
};
