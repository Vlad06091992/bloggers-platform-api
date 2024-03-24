import express, {Response} from "express";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {usersService} from "../users/users-service";
import {RequestWithBody} from "../../types";
import {AuthCreateModel} from "./types/types";
import {authService} from "../auth/auth-service";
import {WithId} from "mongodb";
import {UserType} from "../users/types/types";

export const getAuthRouter = () => {
    const router = express.Router();
    router.post(
        "/login",
        async (
            req: RequestWithBody<AuthCreateModel>,
            res: Response<any>,
        ) => {
            let user: WithId<UserType> = await usersService.findUserByLoginOrEmail(req.body.emailOrLogin, "object") as WithId<UserType>;
            if (!user) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            } else {
                const result = await authService.checkPassword(user.password, req.body.password)
                if (!result) {
                    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
                } else {
                    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                }
            }
        },
    );


    return router
}