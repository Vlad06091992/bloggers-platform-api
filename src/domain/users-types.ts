import {ObjectId} from "mongodb";
import {Moment} from "moment";
import {HydratedDocument, Model} from "mongoose";

export type UserType = {
    _id: ObjectId;
    email: string;
    password: string;
    login: string;
    createdAt: string;
    registrationData: {
        confirmationCode: string,
        expirationDate: Moment
        isConfirmed: boolean
    }
}

export type UserModelInstanceMethods = {
    canBeConfirmed: () => boolean
    confirm: () => void
    changeLogin: (login: string) => void
}

export type UserModelStaticMethods = {
    makeInstance: (email: string, login: string, password: string,) => HydratedDocument<UserType, UserModelInstanceMethods>
};
export type UserSchemaType = Model<UserType, {}, UserModelInstanceMethods> & UserModelStaticMethods

