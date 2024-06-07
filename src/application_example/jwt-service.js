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
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = require("src/features/auth/auth-repository");
const usersSessionService_1 = require("src/features/userSessions/usersSessionService");
const settings = {
    JWT_SECRET: process.env.JWT_SECRET || '234'
};
exports.jwtService = {
    createJWT(userId, deviceId, expiresIn = '1h') {
        const token = jsonwebtoken_1.default.sign({ userId, deviceId }, settings.JWT_SECRET, { expiresIn });
        return token;
    },
    generateTokensPair(userId, deviceId, { expiresInAccess, expiresInRefresh }) {
        const accessToken = this.createJWT(userId, deviceId, expiresInAccess);
        const refreshToken = this.createJWT(userId, deviceId, expiresInRefresh);
        const { iat, exp } = jsonwebtoken_1.default.decode(refreshToken);
        return { accessToken, refreshToken, refreshTokenData: { iatRefreshToken: iat, expRefreshToken: exp } };
    },
    getUserDataByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenInBlackList = yield auth_repository_1.AuthRepository.findToken(token);
                if (!!tokenInBlackList) {
                    return null;
                }
                const res = jsonwebtoken_1.default.verify(token, settings.JWT_SECRET);
                const session = yield this.checkSession(res.deviceId);
                if (session)
                    return res;
                return null;
            }
            catch (e) {
                return null;
            }
        });
    },
    putTokenInBlackList(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auth_repository_1.AuthRepository.putTokenInBlackList(data);
        });
    },
    checkSession(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return usersSessionService_1.usersSessionService.getSessionByDeviceId(deviceId);
            }
            catch (e) {
                return null;
            }
        });
    }
};
