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
exports.getAuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_statuses_1 = require("../../http_statuses/http_statuses");
const users_service_1 = require("src/application_example/users-service");
const auth_service_1 = require("src/application_example/auth-service");
const validateUserCredentials_1 = require("./validators/validateUserCredentials");
const validateErrors_1 = require("../../middlewares/validateErrors");
const jwt_service_1 = require("src/application_example/jwt-service");
const bearerAuthMiddleware_1 = require("../../middlewares/bearerAuthMiddleware");
const uuid_1 = require("uuid");
const validateCreateUserData_1 = require("./validators/validateCreateUserData");
const express_validator_1 = require("express-validator");
const attemptsMiddleware_1 = require("../../middlewares/attemptsMiddleware");
const usersSessionService_1 = require("../userSessions/usersSessionService");
const moment_1 = __importDefault(require("moment"));
const getAuthRouter = () => {
    const router = express_1.default.Router();
    router.post("/login", attemptsMiddleware_1.attemptsMiddleware, validateUserCredentials_1.validateAuthUserData, validateErrors_1.validateErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let user = yield users_service_1.usersService.findUserByLoginOrEmail(req.body.loginOrEmail, "object");
        if (!user) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
        }
        else {
            const result = yield auth_service_1.authService.checkPassword(user.password, req.body.password);
            if (!result) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
            }
            else {
                const deviceId = (0, uuid_1.v4)();
                const userId = user._id.toString();
                const { accessToken, refreshToken, refreshTokenData } = jwt_service_1.jwtService.generateTokensPair(userId, deviceId, {
                    expiresInAccess: '10s',
                    expiresInRefresh: '20s'
                });
                const session = new usersSessionService_1.Session(userId, req.ip, req.headers["user-agent"], (0, moment_1.default)().utc().format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]"), deviceId, (0, moment_1.default)(refreshTokenData.iatRefreshToken * 1000).utc().format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]"), (0, moment_1.default)(refreshTokenData.expRefreshToken * 1000).utc().format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]"));
                yield usersSessionService_1.usersSessionService.createSession(session);
                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, });
                res.send({ accessToken }).status(http_statuses_1.HTTP_STATUSES.OK_200);
            }
        }
    }));
    router.post("/registration", attemptsMiddleware_1.attemptsMiddleware, validateCreateUserData_1.validateCreateUserData, validateErrors_1.validateErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const confirmationCode = (0, uuid_1.v4)();
        yield auth_service_1.authService.createUser(req.body, confirmationCode);
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
    }));
    router.post("/refresh-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshTokenOld = req.cookies.refreshToken;
        const result = yield jwt_service_1.jwtService.getUserDataByToken(refreshTokenOld);
        if (!result) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        if (result.userId) {
            yield jwt_service_1.jwtService.putTokenInBlackList({ token: refreshTokenOld });
            const { accessToken, refreshToken } = jwt_service_1.jwtService.generateTokensPair(result.userId, result.deviceId, {
                expiresInAccess: '10s',
                expiresInRefresh: '20s'
            });
            const lastActiveDate = (0, moment_1.default)().utc().format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]");
            yield usersSessionService_1.usersSessionService.updateSession(result.deviceId, lastActiveDate);
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, });
            res.send({ accessToken }).status(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.clearCookie('refreshToken');
            res.sendStatus(http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
        }
    }));
    router.post("/logout", 
    // validateCreateUserData,
    // validateErrors,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshTokenOld = req.cookies.refreshToken;
        const result = yield jwt_service_1.jwtService.getUserDataByToken(refreshTokenOld);
        if (!result) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        if (result.userId && result.deviceId) {
            yield jwt_service_1.jwtService.putTokenInBlackList({ token: refreshTokenOld });
            yield usersSessionService_1.usersSessionService.deleteSessionByDeviceId(result.deviceId);
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.clearCookie('refreshToken');
            res.sendStatus(http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
        }
    }));
    router.post("/registration-confirmation", attemptsMiddleware_1.attemptsMiddleware, (0, express_validator_1.check)('code').isString(), validateErrors_1.validateErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield auth_service_1.authService.checkConfirmationCode(req.body.code);
        if (result) {
            res.send(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.status(http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400).send({
                errorsMessages: [{
                        message: 'user not found or code expired',
                        field: 'code'
                    }]
            });
        }
    }));
    router.post("/registration-email-resending", attemptsMiddleware_1.attemptsMiddleware, (0, express_validator_1.check)('email').isEmail(), validateErrors_1.validateErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield auth_service_1.authService.resendEmail(req.body.email);
        if (result) {
            res.send(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.status(http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400).send({
                errorsMessages: [{
                        message: 'user not found or code expired',
                        field: 'email'
                    }]
            });
        }
    }));
    router.get("/me", bearerAuthMiddleware_1.authBearerMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let user = req.user;
        if (!user) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.UNAUTHORIZED_401);
        }
        else {
            res.send(users_service_1.usersService.mapUserViewModelToAuthMeUser(user)).status(http_statuses_1.HTTP_STATUSES.OK_200);
        }
    }));
    return router;
};
exports.getAuthRouter = getAuthRouter;
