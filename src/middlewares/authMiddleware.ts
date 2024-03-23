import { NextFunction, Response } from "express";
import basicAuth from "express-basic-auth";

export const authMiddleware = basicAuth({
  users: { admin: "qwerty" },
});

// export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
//     if (req.headers.authorization != "Basic YWRtaW46cXdlcnR5") {
//         res.sendStatus(401)
//     } else {
//         next()
//     }
// };
