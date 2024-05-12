import {UserSession, UserSessionViewModel} from "../userSessions/types";

export const mapSessionToViewModel = (session:UserSession): UserSessionViewModel => {
    return {
        deviceId:session.deviceId,
        title:session.title,
        lastActiveDate:session.lastActiveDate,
        ip:session.ip
    }
}