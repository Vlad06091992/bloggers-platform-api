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
exports.usersSessionService = exports.Session = void 0;
const usersSessionsRepository_1 = require("./usersSessionsRepository");
const mongodb_1 = require("mongodb");
class Session {
    constructor(userId, ip, title, lastActiveDate, deviceId, iatRefreshToken, expRefreshToken) {
        this._id = new mongodb_1.ObjectId();
        this.userId = userId;
        this.ip = ip;
        this.deviceId = deviceId;
        this.lastActiveDate = lastActiveDate;
        this.iatRefreshToken = iatRefreshToken;
        this.expRefreshToken = expRefreshToken;
        this.title = title;
    }
}
exports.Session = Session;
exports.usersSessionService = {
    createSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersSessionsRepository_1.usersSessionsRepository.createSession(session);
        });
    },
    updateSession(deviceId, lastActiveDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersSessionsRepository_1.usersSessionsRepository.updateSession(deviceId, lastActiveDate);
        });
    },
    getUserSession(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersSessionsRepository_1.usersSessionsRepository.getUserSession(userId);
        });
    },
    getSessionByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersSessionsRepository_1.usersSessionsRepository.getSessionByDeviceId(deviceId);
        });
    },
    deleteSessionByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            // return await usersSessionsRepository.deleteSessionByDeviceId(deviceId)
            const result = usersSessionsRepository_1.usersSessionsRepository.deleteSessionByDeviceId(deviceId);
            console.log(result);
            return result;
        });
    },
    deleteOtherSession(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersSessionsRepository_1.usersSessionsRepository.deleteOtherSession(userId, deviceId);
        });
    },
};
