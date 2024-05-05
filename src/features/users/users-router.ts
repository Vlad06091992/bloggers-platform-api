import express, { Response } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../../types";
import {validateCreateUserData} from "./validators/validateCreateUserData";
import {usersService} from "../users/users-service";

import {validateErrors} from "../../middlewares/validateErrors";
import {QueryUserModel, ResponseUsersModel, URIParamsUserIdModel, UserCreateModel, UserViewModel} from "./types/types";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {usersRepository} from "./users-repository";
import {authMiddleware} from "../../middlewares/authMiddleware";



export const getUsersRouter = () => {
  const router = express.Router();
  router.get(
    "/",
      authMiddleware,
    async (
      req: RequestWithQuery<QueryUserModel>,
      res: Response<ResponseUsersModel>,
    ) => {
      let foundedUsers:ResponseUsersModel = await usersRepository.findUsers(req.query);
      res.status(HTTP_STATUSES.OK_200).send(foundedUsers);
    },
  );

  router.post(
    "/",
      authMiddleware,
    validateCreateUserData,
    validateErrors,
    async (
      req: RequestWithBody<UserCreateModel>,
      res: Response<UserViewModel>,
    ) => {
      let newUser = await usersService.createUser({...req.body, isConfirmed:true});
      res.status(HTTP_STATUSES.CREATED_201).send(newUser);
    },
  );


  router.delete(
      "/:id",
      authMiddleware,
      async (
          req: RequestWithParams<URIParamsUserIdModel>,
          res: Response<number>,
      ) => {
        const isDeleted = await usersService.deleteUser(req.params.id);
        if (isDeleted) {
          res.send(HTTP_STATUSES.NO_CONTENT_204);
        } else {
          res.send(HTTP_STATUSES.NOT_FOUND_404);
        }
      },
  );

  // router.get(
  //   "/:id",
  //   async (
  //     req: RequestWithParams<URIParamsPostIdModel>,
  //     res: Response<UserViewModel | number>,
  //   ) => {
  //     const post = await commentsService.getPostById(req.params.id);
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
  //     const isExistsPost = await commentsService.getPostById(req.params.id);
  //     if (!isExistsPost) {
  //       res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  //       return;
  //     }
  //     await commentsRepository.updatePost(req.params.id, req.body);
  //     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  //   },
  // );


  return router;
};
