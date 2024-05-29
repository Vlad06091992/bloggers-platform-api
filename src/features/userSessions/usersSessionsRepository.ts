import {UserSessionType} from "./types";
import {UserSessionModelClass} from "../../mongoose/models";

export const usersSessionsRepository = {
    async updateSession(deviceId: string, lastActiveDate: string) {
        return await UserSessionModelClass.updateOne({deviceId}, {$set: {lastActiveDate}})
    },


    async getSessionByDeviceId(deviceId: string) {
        return UserSessionModelClass.findOne({deviceId});
    },

    async createSession(session: UserSessionType) {

        const createdSession = await UserSessionModelClass.create(session)
        return createdSession


    },


    async getUserSession(userId: string) {
        return UserSessionModelClass.find({userId});

    },

    async deleteSessionByDeviceId(deviceId: string) {

        try {
            let result = await UserSessionModelClass.deleteOne({deviceId});

            console.log(result)

            return result.deletedCount === 1;
        } catch (e) {
            console.log('false')
            return false;
        }
    },

    async deleteOtherSession(userId: string, deviceId: string) {
        try {
            let result = await UserSessionModelClass.deleteMany({$and: [{userId: userId}, {deviceId: {$ne: deviceId}}]})
            return result.deletedCount === 1;
        } catch (e) {
            return false;
        }
    },

    async deleteAllSessions() {
        let result = await UserSessionModelClass.deleteMany({})
        return true
    },

}