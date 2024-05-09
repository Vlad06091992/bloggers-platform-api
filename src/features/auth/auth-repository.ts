import {tokensBlackListCollection} from "../../db-mongo";
import {ObjectId} from "mongodb";
import {TokenType} from "../../types";

export const AuthRepository = {
    async findToken(token:string){
        try {
            return  await tokensBlackListCollection.findOne({token});

        } catch (e){
            return null
        }
    },
    async putTokenInBlackList(data:TokenType){
        return  await tokensBlackListCollection.insertOne(data);
    }
}