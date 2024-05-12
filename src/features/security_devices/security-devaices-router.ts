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
            const result = await jwtService.getUserDataByToken(refreshToken)

            if(!result){
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
                return
            }

            let foundedSessions = await usersSessionService.getUserSession(result.userId);
            res.status(HTTP_STATUSES.OK_200).send(foundedSessions);
        },
    );


    router.delete(
        "/devices/:sessionId",
        async (
            req: RequestWithParams<{ sessionId: string }>,
            res: Response,
        ) => {
            const refreshToken = req.cookies.refreshToken
            const result = await jwtService.getUserDataByToken(refreshToken)

            if(!result){
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
                return
            }

            const {userId,deviceId} = result

            const session = await usersSessionService.getSessionBySessionId(req.params.sessionId)

            if(session?.userId !== userId){
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
                return
            }



            if (req.params.sessionId) {
                const isDeleted = await usersSessionService.deleteSession(req.params.sessionId);

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
            const result = await jwtService.getUserDataByToken(refreshToken)

            if(!result){
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
                return
            }

             await usersSessionService.deleteOtherSession(result.userId,result.deviceId)

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

        },
    );

    return router
}