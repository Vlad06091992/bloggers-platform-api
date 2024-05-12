import {UserSession} from "./types";
import {usersSessionsCollection} from "../../db-mongo";
import {ObjectId} from "mongodb";

export const usersSessionsRepository = {
    async updateSession(deviceId: string, lastActiveDate:string) {
        return await usersSessionsCollection.updateOne({deviceId},{$set:{lastActiveDate}})
    },


    async getSessionByDeviceId(deviceId: string) {
        return await usersSessionsCollection.findOne({deviceId})
    },

    async createSession(session: UserSession) {
        return await usersSessionsCollection.insertOne(session)
    },

    async getUserSession(userId: string) {
        const res = await usersSessionsCollection.find({userId}).toArray();
        return res
    },

    async deleteSessionByDeviceId(deviceId: string) {
        try {
            let result = await usersSessionsCollection.deleteOne({deviceId});
            return result.deletedCount === 1;
        } catch (e) {
            return false;
        }
    },

    async deleteOtherSession(userId: string, deviceId: string) {
        try {
            let result = await usersSessionsCollection.deleteMany({$and: [{userId: userId}, {deviceId: {$ne: deviceId}}]})
            return result.deletedCount === 1;
        } catch (e) {
            return false;
        }
    },

    async deleteAllSessions() {
        let result = await usersSessionsCollection.deleteMany({})
        return true
    },

}