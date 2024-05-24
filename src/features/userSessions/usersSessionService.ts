import {UserSession} from "./types";
import {usersSessionsRepository} from "./usersSessionsRepository";
import {ObjectId} from "mongodb";

export class Session implements UserSession {

    constructor(userId:string,ip:string,title:string,lastActiveDate:string,deviceId:string,iatRefreshToken:string,expRefreshToken:string) {
        this._id = new ObjectId()
        this.userId = userId
        this.ip = ip
        this.deviceId = deviceId
        this.lastActiveDate = lastActiveDate
        this.iatRefreshToken = iatRefreshToken
        this.expRefreshToken = expRefreshToken
        this.title = title
    }
    _id:ObjectId;
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

    async updateSession(deviceId: string, lastActiveDate:string) {
        return await usersSessionsRepository.updateSession(deviceId,lastActiveDate)
    },

    async getUserSession(userId:string) {
        return  await usersSessionsRepository.getUserSession(userId)
    },

    async getSessionByDeviceId(deviceId:string) {
        return  await usersSessionsRepository.getSessionByDeviceId(deviceId)
    },

    async deleteSessionByDeviceId(deviceId: string) {
        // return await usersSessionsRepository.deleteSessionByDeviceId(deviceId)
        const result =  usersSessionsRepository.deleteSessionByDeviceId(deviceId)

        console.log(result)

        return result

    },

    async deleteOtherSession(userId: string, deviceId: string) {
        return await usersSessionsRepository.deleteOtherSession(userId, deviceId)
    },

}