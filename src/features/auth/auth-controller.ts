import {AuthService} from "../../features/auth/auth-service";
import {RequestWithBody} from "../../types/types";
import {AuthCreateModel, ConfirmationCode, RefreshTokensModel, ResendingEmail} from "../../features/auth/types/types";
import {Response} from "express";
import {WithId} from "mongodb";
import {UserCreateModel, UserType, UserViewModel} from "../../features/users/types/types";
import {usersService} from "../../features/users/users-service";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {v4 as uuidv4} from "uuid";
import {jwtService} from "../../features/auth/jwt-service";
import {Session, usersSessionService} from "../../features/userSessions/usersSessionService";
import moment from "moment/moment";

export class AuthController {
    constructor(protected authService: AuthService) {
        this.authService = authService
    }

    async login(
        req: RequestWithBody<AuthCreateModel>,
        res: Response<any>,
    ) {
        const user: WithId<UserType> = await usersService.findUserByLoginOrEmail(req.body.loginOrEmail, "object") as WithId<UserType>;
        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        } else {
            console.log(this)
            const result = await this.authService.checkPassword(user.password, req.body.password)
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
                    expiresInAccess: '5h',
                    expiresInRefresh: '10h'
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
                res.send({accessToken,refreshToken}).status(HTTP_STATUSES.OK_200)
            }
        }
    }

    async registration(req: RequestWithBody<UserCreateModel>,
                       res: Response<UserViewModel>,) {
        const confirmationCode = uuidv4()
        await this.authService.createUser(req.body, confirmationCode)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async passwordRecovery(req: RequestWithBody<{ email: string }>,
                           res: Response<number>,) {
        const recoveryCode = uuidv4()
        const email = req.body.email

        const user = await usersService.findUserByLoginOrEmail(email, "object")
        if (user && typeof user === 'object') {
            await this.authService.recoveryPassword({
                recoveryCode,
                email,
                userId: user._id.toString(),
                expirationDate: moment().add(1, 'hour').toString(),
            })
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async newPassword(
        req: RequestWithBody<{
            "newPassword": string,
            "recoveryCode": string
        }>,
        res: Response,) {

        const result = await this.authService.newPassword(req.body)
        if (!result) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                errorsMessages: [{
                    message: "The 'recoveryCode' is incorrect",
                    field: "recoveryCode"
                }]
            });
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async refreshToken(
        req: RequestWithBody<any>,
        res: Response<RefreshTokensModel>) {
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
    }

    async logout(
        req: RequestWithBody<UserCreateModel>,
        res: Response<RefreshTokensModel>) {
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
    }

    async registrationConfirmation(req: RequestWithBody<ConfirmationCode>,
                                   res: Response<number | {
                                       errorsMessages: Array<{ message: string, field: string }>
                                   }>,) {
        const result = await this.authService.checkConfirmationCode(req.body.code)

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
    }

    async registrationEmailResending(
        req: RequestWithBody<ResendingEmail>,
        res: Response<number | { errorsMessages: Array<{ message: string, field: string }> }>,) {

        let result = await this.authService.resendEmail(req.body.email)
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

    }

    async me(
        req: any,
        res: Response<any>,
    ) {
        let user: UserViewModel = req.user
        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        } else {
            res.send(usersService.mapUserViewModelToAuthMeUser(user)).status(HTTP_STATUSES.OK_200)
        }
    }
}