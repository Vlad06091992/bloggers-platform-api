import {ObjectId, WithId} from "mongodb";
import {UserAuthMeModel, UserCreateModel, UserType, UserViewModel} from "./types/types";
import {usersRepository} from "./users-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid"
import moment, {Moment} from "moment";
import {RecoveryPasswordsCodesModelClass} from "../../mongoose/models";

type ResultType = "object" | "boolean";

class User {
    _id: ObjectId;
    createdAt: string;
    registrationData: {
        confirmationCode: string,
        expirationDate: any
        isConfirmed: boolean
    }
    constructor( public email:string,public password:string,public login:string,public isConfirmed:boolean | undefined = false,public confirmationCode:string) {
        this._id = new ObjectId();
        this.createdAt = new Date().toISOString();
        this.registrationData = {
            confirmationCode: confirmationCode || uuidv4(),
            expirationDate: moment().add(1, 'hour').toString(),
            isConfirmed: isConfirmed
        }
    }
}

export const usersService = {

    async findUserDataByRecoveryCode(recoveryCode: string) {
        return await RecoveryPasswordsCodesModelClass.findOne({recoveryCode})
    },

    async getUserById(id: string) {
        return await usersRepository.getUserById(id)
    },

    async createUser(body: UserCreateModel) {
        const passwordHash = await this._createHash(body.password)

        const{createdAt,confirmationCode,isConfirmed,login,password,email} = body

        const result = new User(email,passwordHash,login,isConfirmed,confirmationCode as string)
        return await usersRepository.createUser(result)
    },

    async _createHash(password: string) {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    },


    getUserWithPrefixIdToViewModel(user: WithId<UserType>): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            createdAt: user.createdAt,
            email: user.email,
        };
    },


    mapUserViewModelToAuthMeUser(user: UserViewModel): UserAuthMeModel {
        return {
            userId: user.id,
            login: user.login,
            email: user.email,
        };
    },

    async findUserByLoginOrEmail<T>(loginOrEmail: string, result: ResultType = "boolean") {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        return result === "boolean" ? !!user : user;
    },

    async deleteUser(id: string) {
        return await usersRepository.deleteUser(id)
    },

};

