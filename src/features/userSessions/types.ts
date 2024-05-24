import {ObjectId} from "mongodb";

export type UserSession = {
    _id:ObjectId;
    userId:string,
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
    iatRefreshToken:string
    expRefreshToken:string
}

export type UserSessionViewModel = Omit<UserSession, "iatRefreshToken" | "expRefreshToken" | "userId" | "_id" >