import bcrypt from "bcrypt";
import {usersRepository} from "../users/users-repository";
import moment from "moment";
import {UsersModelClass} from "../../mongoose/models";
import {usersService} from "../users/users-service";
import {emailManager} from "../../managers/email-manager";
import {UserCreateModel} from "../users/types/types";
import {v4 as uuidv4} from "uuid";
import {RecoveryPasswordsCodesType} from "../../features/auth/types/types";
import {AuthRepository} from "../../features/auth/auth-repository";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import "reflect-metadata"
@injectable()
export class AuthService  {
    // constructor(protected authRepository:AuthRepository) {
    //     this.authRepository = authRepository
    // }

    constructor(@inject(AuthRepository) protected authRepository:AuthRepository) {
        // this.authRepository = authRepository
    }



    async recoveryPassword({recoveryCode, email, userId, expirationDate}: Omit<RecoveryPasswordsCodesType, '_id'>) {
        await emailManager.sendEmailRecoveryPassword(email, recoveryCode)
        const _id = new ObjectId()
        await this.authRepository.addPasswordResetCode({recoveryCode, userId, email, _id, expirationDate})
    }

    async createUser(body: UserCreateModel, confirmationCode: string) {
        const newUser = await usersService.createUser({...body, confirmationCode, isConfirmed: false});
        await emailManager.sendEmailConfirmationMessage(newUser, confirmationCode)
    }


    async resendEmail(email: string) {
        const user = await usersRepository.findUserByLoginOrEmail(email)
        if (user && !user.registrationData.isConfirmed) {
            const confirmationCode = uuidv4()
            const expirationDate = moment().add(1, 'hour').toString()
            const userViewModel = usersService.getUserWithPrefixIdToViewModel(user)
            await emailManager.sendEmailConfirmationMessage(userViewModel, confirmationCode)
            try {
                let result = await UsersModelClass.updateOne(
                    {_id: user._id},
                    {
                        $set: {
                            'registrationData.confirmationCode': confirmationCode,
                            'registrationData.expirationDate': expirationDate
                        }
                    }
                );
                return result.matchedCount == 1;
            } catch (e) {
                return false;
            }
        } else {
            return false
        }

    }

    async checkPassword(userPassword: string, enteredPassword: string) {
        return await bcrypt.compare(enteredPassword, userPassword);
    }
    async checkConfirmationCode(code: string) {
        let user = await usersRepository.findUserByConfirmationCode(code)

        if (user && !user.registrationData.isConfirmed && user.registrationData.expirationDate.toString() > moment().toString()) {
            try {
                let result = await UsersModelClass.updateOne(
                    {_id: user._id},
                    {$set: {'registrationData.isConfirmed': true}}
                );
                return result.matchedCount == 1;
            } catch (e) {
                return false;
            }
        } else {
            return false
        }
    }


    async newPassword({newPassword, recoveryCode}: {
        "newPassword": string,
        "recoveryCode": string
    }) {

        const userData = await usersService.findUserDataByRecoveryCode(recoveryCode)

        console.log(userData)

        if (userData && userData.expirationDate.toString() > moment().toString()) {
            try {
                let result = await UsersModelClass.updateOne(
                    {_id: new ObjectId(userData.userId)},
                    {$set: {password: await usersService._createHash(newPassword.toString())}}
                );

                console.log(result)

                return result.matchedCount == 1;
            } catch (e) {
                console.log(e)
                return false;
            }
        } else {
            return false
        }
    }
}



