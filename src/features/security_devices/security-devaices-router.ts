import express, {Request, Response} from "express";
import {usersSessionService} from "../userSessions/usersSessionService";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {RequestWithParams} from "../../types";
import {jwtService} from "../../application_example/jwt-service";
import {mapSessionToViewModel} from "../userSessions/utils";


export const getSecurityDevicesRouter = () => {
    const router = express.Router();
    router.get(
        "/devices",
        async (
            req: Request,
            res: Response,
        ) => {
            const refreshToken = req.cookies.refreshToken
            const result = await jwtService.getUserDataByToken(refreshToken)

            if (!result) {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
                return
            }
            const foundedSessions = await usersSessionService.getUserSession(result.userId);
            res.status(HTTP_STATUSES.OK_200).send(foundedSessions.map(mapSessionToViewModel));
        },
    );


    router.delete(
        "/devices/:deviceId",
        async (
            req: RequestWithParams<{ deviceId: string }>,
            res: Response,
        ) => {
            const refreshToken = req.cookies.refreshToken
            const result = await jwtService.getUserDataByToken(refreshToken)

            if (!result) {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
                return
            }

            const {userId, deviceId} = result
            const session = await usersSessionService.getSessionByDeviceId(req.params.deviceId)

            if (session?.userId && session?.userId !== userId) {
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
                return
            }


            if (req.params.deviceId) {
                const isDeleted = await usersSessionService.deleteSessionByDeviceId(req.params.deviceId);

                if (isDeleted) {
                    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                    return
                }

                if (!isDeleted) {
                    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                    return
                }

            }
        },
    );


    router.delete(
        "/devices",
        async (
            req: Request,
            res: Response,
        ) => {
            const refreshToken = req.cookies.refreshToken
            const result = await jwtService.getUserDataByToken(refreshToken)

            if (!result) {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
                return
            }

            await usersSessionService.deleteOtherSession(result.userId, result.deviceId)

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

        },
    );

    return router
}