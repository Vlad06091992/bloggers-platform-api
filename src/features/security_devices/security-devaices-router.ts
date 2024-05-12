import express, {Response, Request} from "express";
import {usersSessionService} from "../userSessions/usersSessionService";
import {HTTP_STATUSES} from "../../http_statuses/http_statuses";
import {RequestWithParams, RequestWithQuery} from "../../types";
import {jwtService} from "../../features/auth/jwt-service";


export const getSecurityDevicesRouter = () => {
    const router = express.Router();
    router.get(
        "/devices",
        async (
            req: Request,
            res: Response,
        ) => {
            const refreshToken = req.cookies.refreshToken
            const {userId} = await jwtService.getUserDataByToken(refreshToken)

            let foundedSessions = await usersSessionService.getUserSession(userId);
            res.status(HTTP_STATUSES.OK_200).send(foundedSessions);
        },
    );


    router.delete(
        "/devices/:deviceId",
        async (
            req: RequestWithParams<{ deviceId: string }>,
            res: Response,
        ) => {
            if (req.params.deviceId) {
                const isDeleted = await usersSessionService.deleteSession(req.params.deviceId);

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
            req: RequestWithParams<{ deviceId: string }>,
            res: Response,
        ) => {
            const refreshToken = req.cookies.refreshToken
            const {userId,deviceId} = await jwtService.getUserDataByToken(refreshToken)

            console.log(userId)
            console.log(deviceId)

            let isDeleted = await usersSessionService.deleteOtherSession(userId,deviceId)

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

        },
    );

    return router
}