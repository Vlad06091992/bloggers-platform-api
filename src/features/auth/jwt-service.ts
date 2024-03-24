import {UserType} from "../users/types/types";
import jwt from "jsonwebtoken"
import {WithId} from "mongodb";

const settings = {
    JWT_SECRET : process.env.JWT_SECRET || '234'
}

export const jwtService = {
    createJWT(user:WithId<UserType>){
        const token = jwt.sign({userId:user._id},settings.JWT_SECRET,{expiresIn:'1h'})
        return token
    },
    getUserIdByToken(token:string){
        try {
            const res:any =  jwt.verify(token,settings.JWT_SECRET)
            return res.userId
        } catch (e){
            debugger
        }
    }
}