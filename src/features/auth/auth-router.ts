import express, {Response, Request} from "express";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {usersService} from "../users/users-service";
import {RequestWithBody} from "../../types";
import {AuthCreateModel, ConfirmationCode, ResendingEmail} from "./types/types";
import {authService} from "../auth/auth-service";
import {WithId} from "mongodb";
import {UserCreateModel, UserType, UserViewModel} from "../users/types/types";
import {validateAuthUserData} from "./validators/validateUserCredentials";
import {validateErrors} from "../../middlewares/validateErrors";
import {jwtService} from "./jwt-service";
import {authBearerMiddleware} from "../../middlewares/bearerAuthMiddleware";
import {emailManager} from "../../managers/email-manager";
import {v4 as uuidv4} from "uuid"
import {validateCreateUserData} from "./validators/validateCreateUserData";
import {check, checkSchema} from "express-validator";
import {isString} from "util";

export const getAuthRouter = () => {
    const router = express.Router();
    router.post(
        "/login",
        validateAuthUserData,
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
                    res.send({accessToken: token}).status(HTTP_STATUSES.OK_200)
                }
            }
        },
    );

    router.post(
        "/registration",
        validateCreateUserData,
        validateErrors,
        async (
            req: RequestWithBody<UserCreateModel>,
            res: Response<UserViewModel>,
        ) => {
            const confirmationCode = uuidv4()
            await authService.createUser(req.body, confirmationCode)
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        },
    );


    router.post(
        "/registration-confirmation",
        check('code').isString(),
        validateErrors,
        async (
            req: RequestWithBody<ConfirmationCode>,
            res: Response<number | {errorsMessages:Array<{message:string,field:string}>}>,
        ) => {

            let result = await authService.checkConfirmationCode(req.body.code)

            if (result) {
                res.send(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages:[{message:'user not found or code expired', field: 'code'}]})
            }
        },
    );

    router.post(
        "/registration-email-resending",
        check('email').isEmail(),
        validateErrors,
        async (
            req: RequestWithBody<ResendingEmail>,
            res: Response<number | {errorsMessages:Array<{message:string,field:string}>}>,
        ) => {
            let result = await authService.resendEmail(req.body.email)
            if (result) {
                res.send(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages:[{message:'user not found or code expired', field: 'code'}]})
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
            let user: UserViewModel = req.user
            if (!user) {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            } else {
                console.log(user)
                res.send(usersService.mapUserViewModelToAuthMeUser(user)).status(200)
            }
        },
    );


    return router
}