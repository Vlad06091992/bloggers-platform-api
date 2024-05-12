import {UserType} from "../users/types/types";
import jwt from "jsonwebtoken"
import {WithId} from "mongodb";
import {AuthRepository} from "./auth-repository";
import {TokenType} from "../../types";

const settings = {
    JWT_SECRET: process.env.JWT_SECRET || '234'
}

export const jwtService = {
    createJWT(userId: string, deviceId: string, expiresIn: string = '1h') {
        const token = jwt.sign({userId, deviceId}, settings.JWT_SECRET, {expiresIn})
        return token
    },

    generateTokensPair(userId: string, deviceId: string, {expiresInAccess, expiresInRefresh}: {
        expiresInAccess: string,
        expiresInRefresh: string,

    }): {
        accessToken: string,
        refreshToken: string
        refreshTokenData:{
            iatRefreshToken:number,
            expRefreshToken:number,
        }
    } {
        const accessToken = this.createJWT(userId,deviceId, expiresInAccess)
        const refreshToken = this.createJWT(userId,deviceId, expiresInRefresh)

        const {iat,exp}:any = jwt.decode(refreshToken)

        return {accessToken, refreshToken,refreshTokenData:{iatRefreshToken:iat,expRefreshToken:exp}}
    },
    async getUserDataByToken(token: string) {
        debugger
        try {
            debugger
            const tokenInBlackList = await AuthRepository.findToken(token)
            if (!!tokenInBlackList) {
                return null
            }
            const res: any = jwt.verify(token, settings.JWT_SECRET)
            return res
        } catch (e) {
            return null
        }
    },
    async putTokenInBlackList(data: TokenType) {
        const {insertedId} = await AuthRepository.putTokenInBlackList(data)
    }
}