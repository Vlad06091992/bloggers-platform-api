import {NextFunction, Response} from "express";
import basicAuth from "express-basic-auth";

export const authGuardMiddleware = basicAuth({
    users: {'admin': 'qwerty'}
})

// export const authGuardMiddleware = (req: any, res: Response, next: NextFunction) => {
//     if (req.headers.authorization != "Basic YWRtaW46cXdlcnR5") {
//         res.sendStatus(401)
//     } else {
//         next()
//     }
// };