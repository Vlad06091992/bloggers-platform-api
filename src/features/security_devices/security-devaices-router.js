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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecurityDevicesRouter = void 0;
const express_1 = __importDefault(require("express"));
const usersSessionService_1 = require("../userSessions/usersSessionService");
const http_statuses_1 = require("../../http_statuses/http_statuses");
const jwt_service_1 = require("src/application_example/jwt-service");
const utils_1 = require("../userSessions/utils");
const getSecurityDevicesRouter = () => {
    const router = express_1.default.Router();
    router.get("/devices", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshToken = req.cookies.refreshToken;
        const result = yield jwt_service_1.jwtService.getUserDataByToken(refreshToken);
        if (!result) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const foundedSessions = yield usersSessionService_1.usersSessionService.getUserSession(result.userId);
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(foundedSessions.map(utils_1.mapSessionToViewModel));
    }));
    router.delete("/devices/:deviceId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshToken = req.cookies.refreshToken;
        const result = yield jwt_service_1.jwtService.getUserDataByToken(refreshToken);
        if (!result) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const { userId, deviceId } = result;
        const session = yield usersSessionService_1.usersSessionService.getSessionByDeviceId(req.params.deviceId);
        if ((session === null || session === void 0 ? void 0 : session.userId) && (session === null || session === void 0 ? void 0 : session.userId) !== userId) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.FORBIDDEN_403);
            return;
        }
        if (req.params.deviceId) {
            const isDeleted = yield usersSessionService_1.usersSessionService.deleteSessionByDeviceId(req.params.deviceId);
            if (isDeleted) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
                return;
            }
            if (!isDeleted) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
        }
    }));
    router.delete("/devices", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshToken = req.cookies.refreshToken;
        const result = yield jwt_service_1.jwtService.getUserDataByToken(refreshToken);
        if (!result) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        yield usersSessionService_1.usersSessionService.deleteOtherSession(result.userId, result.deviceId);
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
    }));
    return router;
};
exports.getSecurityDevicesRouter = getSecurityDevicesRouter;
