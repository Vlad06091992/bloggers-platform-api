export type UserSession = {
    userId:string,
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
    iatRefreshToken:string
    expRefreshToken:string
}