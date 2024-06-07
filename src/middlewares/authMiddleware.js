"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
exports.authMiddleware = (0, express_basic_auth_1.default)({
    users: { admin: "qwerty" },
});
// export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
//     if (req.headers.authorization != "Basic YWRtaW46cXdlcnR5") {
//         res.sendStatus(401)
//     } else {
//         next()
//     }
// };
