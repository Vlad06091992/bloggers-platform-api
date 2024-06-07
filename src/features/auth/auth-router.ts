import express, {Response} from "express";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {usersService} from "../../application_example/users-service";
import {RequestWithBody} from "../../types";
import {AuthCreateModel, ConfirmationCode, RefreshTokensModel, ResendingEmail} from "./types/types";
import {authService} from "../../application_example/auth-service";
import {WithId} from "mongodb";
import {UserCreateModel, UserViewModel} from "../users/types/types";
import {validateAuthUserData} from "./validators/validateUserCredentials";
import {validateErrors} from "../../middlewares/validateErrors";
import {jwtService} from "../../application_example/jwt-service";
import {authBearerMiddleware} from "../../middlewares/bearerAuthMiddleware";
import {v4 as uuidv4} from "uuid"
import {validateCreateUserData} from "./validators/validateCreateUserData";
import {check} from "express-validator";
import {attemptsMiddleware} from "../../middlewares/attemptsMiddleware";
import {Session, usersSessionService} from "../userSessions/usersSessionService";
import moment from "moment";
import {UserType} from "../../domain/users-types";


export const getAuthRouter = () => {
    const router = express.Router();
    router.post(
        "/login",
        attemptsMiddleware,
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
                    const deviceId = uuidv4()
                    const userId = user._id.toString()
                    const {
                        accessToken,
                        refreshToken,
                        refreshTokenData
                    } = jwtService.generateTokensPair(userId, deviceId, {
                        expiresInAccess: '10s',
                        expiresInRefresh: '20s'
                    })

                    const session = new Session(userId,
                        req.ip as any,
                        req.headers["user-agent"] as any,
                        moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]"),
                        deviceId,
                        moment(refreshTokenData.iatRefreshToken * 1000).utc().format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]"),
                        moment(refreshTokenData.expRefreshToken * 1000).utc().format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]"),
                    )
                    await usersSessionService.createSession(session)

                    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
                    res.send({accessToken}).status(HTTP_STATUSES.OK_200)
                }
            }
        },
    );

    router.post(
        "/registration",
        attemptsMiddleware,
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
        "/refresh-token",
        async (
            req: RequestWithBody<any>,
            res: Response<RefreshTokensModel>,
        ) => {
            const refreshTokenOld = req.cookies.refreshToken

            const result = await jwtService.getUserDataByToken(refreshTokenOld)

            if (!result) {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
                return
            }

            if (result.userId) {
                await jwtService.putTokenInBlackList({token: refreshTokenOld})


                const {accessToken, refreshToken} = jwtService.generateTokensPair(result.userId, result.deviceId, {
                    expiresInAccess: '10s',
                    expiresInRefresh: '20s'
                })

                const lastActiveDate = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]")

                await usersSessionService.updateSession(result.deviceId, lastActiveDate)

                res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
                res.send({accessToken}).status(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.clearCookie('refreshToken');
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            }
        },
    );


    router.post(
        "/logout",
        // validateCreateUserData,
        // validateErrors,
        async (
            req: RequestWithBody<UserCreateModel>,
            res: Response<RefreshTokensModel>,
        ) => {
            const refreshTokenOld = req.cookies.refreshToken

            const result = await jwtService.getUserDataByToken(refreshTokenOld)

            if (!result) {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
                return
            }

            if (result.userId && result.deviceId) {
                await jwtService.putTokenInBlackList({token: refreshTokenOld})
                await usersSessionService.deleteSessionByDeviceId(result.deviceId)
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.clearCookie('refreshToken');
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            }


        },
    );


    router.post(
        "/registration-confirmation",
        attemptsMiddleware,
        check('code').isString(),
        validateErrors,
        async (
            req: RequestWithBody<ConfirmationCode>,
            res: Response<number | { errorsMessages: Array<{ message: string, field: string }> }>,
        ) => {

            let result = await authService.checkConfirmationCode(req.body.code)

            if (result) {
                res.send(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                    errorsMessages: [{
                        message: 'user not found or code expired',
                        field: 'code'
                    }]
                })
            }
        },
    );

    router.post(
        "/registration-email-resending",
        attemptsMiddleware,
        check('email').isEmail(),
        validateErrors,
        async (
            req: RequestWithBody<ResendingEmail>,
            res: Response<number | { errorsMessages: Array<{ message: string, field: string }> }>,
        ) => {
            let result = await authService.resendEmail(req.body.email)
            if (result) {
                res.send(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                    errorsMessages: [{
                        message: 'user not found or code expired',
                        field: 'email'
                    }]
                })
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
                res.send(usersService.mapUserViewModelToAuthMeUser(user)).status(HTTP_STATUSES.OK_200)
            }
        },
    );


    return router
}