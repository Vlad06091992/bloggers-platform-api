import {NextFunction, Response} from "express";
import {jwtService} from "../features/auth/jwt-service";
import {usersService} from "../features/users/users-service";
import {HTTP_STATUSES} from "../http_statuses/http_statuses";

export const checkUserByAccessToken = async (req:any, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        req.userId = null
        req.user = null
        next()
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    const result = await jwtService.getUserDataByToken(token)

    if (result && result.userId) {
        const{userId} = result
        const user = await usersService.getUserById(userId)
        req.user = user
        req.userId = userId
        next()
        return
    } else {
       req.userId = null
       req.user = null
        next()
        return
    }
};