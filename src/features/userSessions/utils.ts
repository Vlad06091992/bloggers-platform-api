import {UserSessionType, UserSessionViewModel} from "../userSessions/types";

export const mapSessionToViewModel = (session:UserSessionType): UserSessionViewModel => {
    return {
        deviceId:session.deviceId,
        title:session.title,
        lastActiveDate:session.lastActiveDate,
        ip:session.ip
    }
}