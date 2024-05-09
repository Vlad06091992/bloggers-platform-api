import {UserType} from "../users/types/types";
import jwt from "jsonwebtoken"
import {WithId} from "mongodb";
import {AuthRepository} from "./auth-repository";
import {TokenType} from "../../types";

const settings = {
    JWT_SECRET: process.env.JWT_SECRET || '234'
}

export const jwtService = {
    createJWT(userId:string, expiresIn: string = '1h') {
        const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn})
        return token
    },

    generateTokensPair(userId: string, {expiresInAccess, expiresInRefresh}: {
        expiresInAccess: string,
        expiresInRefresh: string
    }): {
        accessToken: string,
        refreshToken: string
    } {
        const accessToken = this.createJWT(userId, expiresInAccess)
        const refreshToken = this.createJWT(userId, expiresInRefresh)

        return {accessToken, refreshToken}

    },
   async getUserIdByToken(token: string) {
        try {
            const tokenInBlackList = await AuthRepository.findToken(token)
            if (!!tokenInBlackList) {
                return null
            }
            const res: any = jwt.verify(token, settings.JWT_SECRET)
            return res.userId
        } catch (e) {
            return null
        }
    },
    async putTokenInBlackList(data:TokenType){
        const { insertedId } = await AuthRepository.putTokenInBlackList(data)
    }
}