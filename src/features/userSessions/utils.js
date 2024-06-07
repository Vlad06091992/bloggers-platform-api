"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSessionToViewModel = void 0;
const mapSessionToViewModel = (session) => {
    return {
        deviceId: session.deviceId,
        title: session.title,
        lastActiveDate: session.lastActiveDate,
        ip: session.ip
    };
};
exports.mapSessionToViewModel = mapSessionToViewModel;
