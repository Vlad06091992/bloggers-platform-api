import {ObjectId} from "mongodb";

export type UserSessionType = {
    _id:ObjectId;
    userId:string,
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
    iatRefreshToken:string
    expRefreshToken:string
}

export type UserSessionViewModel = Omit<UserSessionType, "iatRefreshToken" | "expRefreshToken" | "userId" | "_id" >