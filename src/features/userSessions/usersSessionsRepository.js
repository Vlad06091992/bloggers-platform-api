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
exports.usersSessionsRepository = void 0;
const models_1 = require("../../mongoose/models");
exports.usersSessionsRepository = {
    updateSession(deviceId, lastActiveDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.UserSessionModelClass.updateOne({ deviceId }, { $set: { lastActiveDate } });
        });
    },
    getSessionByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.UserSessionModelClass.findOne({ deviceId });
        });
    },
    createSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdSession = yield models_1.UserSessionModelClass.create(session);
            return createdSession;
        });
    },
    getUserSession(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.UserSessionModelClass.find({ userId });
        });
    },
    deleteSessionByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.UserSessionModelClass.deleteOne({ deviceId });
                console.log(result);
                return result.deletedCount === 1;
            }
            catch (e) {
                console.log('false');
                return false;
            }
        });
    },
    deleteOtherSession(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.UserSessionModelClass.deleteMany({ $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }] });
                return result.deletedCount === 1;
            }
            catch (e) {
                return false;
            }
        });
    },
    deleteAllSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield models_1.UserSessionModelClass.deleteMany({});
            return true;
        });
    },
};
