import {TokensBlacklistModelClass} from "../../infrastructure/mongoose/models";
import {ObjectId} from "mongodb";
import {TokenType} from "../../types";

export const AuthRepository = {
    async findToken(token: string) {
        try {
            return await TokensBlacklistModelClass.findOne({token});

        } catch (e) {
            return null
        }
    },
    async putTokenInBlackList(data: Omit<TokenType, "_id">) {
        const tokenWithPrefixId = {
            _id: new ObjectId(),
            token: data.token
        }
        return await TokensBlacklistModelClass.create(tokenWithPrefixId);
    },
    async clearAllBlackList() {
        return await TokensBlacklistModelClass.deleteMany({});
        return true
    }
}