import {NextFunction, Request, Response} from "express";
import {Result, validationResult} from "express-validator";
import {jwtService} from "../features/auth/jwt-service";
import {usersService} from "../features/users/users-service";

export const authBearerMiddleware = async (req:any, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return
    }


    const token = req.headers.authorization.split(' ')[1]
    const userId = jwtService.getUserIdByToken(token)
    if (userId) {
        const user = await usersService.getUserById(userId)
        req.user = user
        next()
        return
    }
    res.send(401)
};