import {ObjectId} from "mongodb";
import moment from "moment/moment";

export type AuthCreateModel = {
   loginOrEmail:string
   password:string
};

export type ConfirmationCode = {code:string}

export type ResendingEmail = {email:string}

export type RefreshTokensModel =  {
accessToken:string
};

export type RecoveryPasswordsCodesType = {
   _id: ObjectId,
   email:string,
   recoveryCode:string
   userId:string
   expirationDate: string
}