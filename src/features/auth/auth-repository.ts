import {RecoveryPasswordsCodesModelClass, TokensBlacklistModelClass} from "../../mongoose/models";
import {ObjectId} from "mongodb";
import {TokenType} from "../../types/types";
import {RecoveryPasswordsCodesType} from "../../features/auth/types/types";

export class AuthRepository  {
    async addPasswordResetCode(data:RecoveryPasswordsCodesType){
        await RecoveryPasswordsCodesModelClass.create(data)
    }

    async findToken(token: string) {
        try {
            return await TokensBlacklistModelClass.findOne({token});

        } catch (e) {
            return null
        }
    }
    async putTokenInBlackList(data: Omit<TokenType, "_id">) {
        const tokenWithPrefixId = {
            _id: new ObjectId(),
            token: data.token
        }
        return await TokensBlacklistModelClass.create(tokenWithPrefixId);
    }
    async clearAllBlackList() {
        return await TokensBlacklistModelClass.deleteMany({});
    }
}


export const authRepository = new AuthRepository()