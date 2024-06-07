"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authBearerMiddleware = void 0;
const jwt_service_1 = require("src/application_example/jwt-service");
const users_service_1 = require("src/application_example/users-service");
const http_statuses_1 = require("../http_statuses/http_statuses");
const authBearerMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.send(401);
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const result = yield jwt_service_1.jwtService.getUserDataByToken(token);
    if (result && result.userId) {
        const { userId } = result;
        const user = yield users_service_1.usersService.getUserById(userId);
        req.user = user;
        next();
        return;
    }
    else {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
    }
});
exports.authBearerMiddleware = authBearerMiddleware;
