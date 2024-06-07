import bcrypt from "bcrypt";

import moment from "moment";

import {usersService} from "../application_example/users-service";
import {emailManager} from "../application_example/managers/email-manager";
import {UserCreateModel} from "../features/users/types/types";
import {v4 as uuidv4} from "uuid";
import {usersRepository} from "../infrastructure/repostitories/users-repository";
import {UsersModelClass} from "../infrastructure/mongoose/models";
import {ObjectId} from "mongodb";


export const authService = {
    async changeLogin(id: ObjectId, login: string) {
        const user = await usersRepository.getUserById(id.toString())
        user!.changeLogin(login)
        return await usersRepository.save(user as any)
    },


    async createUser(body: UserCreateModel, confirmationCode: string) {
        const passwordHash = await usersService._createHash(body.password)
        const newUser = await UsersModelClass.makeInstance(body.email, body.login, passwordHash)
        await emailManager.sendEmailConfirmationMessage(newUser, confirmationCode)
    },


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

    },

    async checkPassword(userPassword: string, enteredPassword: string) {
        return await bcrypt.compare(enteredPassword, userPassword);
    },
    async checkConfirmationCode(code: string) {

        console.log(code)

        const user = await usersRepository.findUserByConfirmationCode(code)


        console.log(user)

        if (!user) return false

        if (user.canBeConfirmed()) {
            user.confirm()
            return usersRepository.save(user as any)

        }
    },


}