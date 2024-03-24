import express, {Response,Request} from "express";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {usersService} from "../users/users-service";
import {RequestWithBody} from "../../types";
import {AuthCreateModel} from "./types/types";
import {authService} from "../auth/auth-service";
import {WithId} from "mongodb";
import {UserType} from "../users/types/types";
import {validateCreateUserData} from "./validators/validateUserCredentials";
import {validateErrors} from "../../middlewares/validateErrors";
import {jwtService} from "./jwt-service";
import {authBearerMiddleware} from "../../middlewares/bearerAuthMiddleware";

export const getAuthRouter = () => {
    const router = express.Router();
    router.post(
        "/login",
        validateCreateUserData,
        validateErrors,
        async (
            req: RequestWithBody<AuthCreateModel>,
            res: Response<any>,
        ) => {
            let user: WithId<UserType> = await usersService.findUserByLoginOrEmail(req.body.loginOrEmail, "object") as WithId<UserType>;
            if (!user) {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            } else {
                const result = await authService.checkPassword(user.password, req.body.password)
                if (!result) {
                    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
                } else {
                    const token = jwtService.createJWT(user)
                    res.send({accessToken:token}).status(HTTP_STATUSES.OK_200)
                }
            }
        },
    );
    router.get(
        "/me",
        authBearerMiddleware,
        async (
            req: any,
            res: Response<any>,
        ) => {
            let user: WithId<UserType> = req.user
            if (!user) {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            } else {
              res.send(user).status(200)
            }
        },
    );


    return router
}