import {UserSession} from "./types";
import {usersSessionsRepository} from "./usersSessionsRepository";

export class Session implements UserSession {

    constructor(userId:string,ip:string,title:string,lastActiveDate:string,deviceId:string,iatRefreshToken:string,expRefreshToken:string) {
        this.userId = userId
        this.ip = ip
        this.deviceId = deviceId
        this.lastActiveDate = lastActiveDate
        this.iatRefreshToken = iatRefreshToken
        this.expRefreshToken = expRefreshToken
        this.title = title
    }

    deviceId: string;
    expRefreshToken: string;
    iatRefreshToken: string;
    ip: string;
    lastActiveDate: string;
    title: string;
    userId: string;
}

export const usersSessionService = {
    async createSession(session: UserSession) {
        return await usersSessionsRepository.createSession(session)
    },

    async getUserSession(userId:string) {
        return  await usersSessionsRepository.getUserSession(userId)
    },

    async getSessionBySessionId(sessionId:string) {
        return  await usersSessionsRepository.getSessionBySessionId(sessionId)
    },

    async deleteSession(sessionId: string) {
        return await usersSessionsRepository.deleteSession(sessionId)
    },

    async deleteOtherSession(userId: string, deviceId: string) {
        return await usersSessionsRepository.deleteOtherSession(userId, deviceId)
    },

}