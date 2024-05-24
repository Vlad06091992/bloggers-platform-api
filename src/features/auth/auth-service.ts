import bcrypt from "bcrypt";
import {usersRepository} from "../users/users-repository";
import moment from "moment";
import {UsersModelClass} from "../../mongoose/models";
import {usersService} from "../users/users-service";
import {emailManager} from "../../managers/email-manager";
import {UserCreateModel} from "../users/types/types";
import {v4 as uuidv4} from "uuid";


export const authService = {
    async createUser(body:UserCreateModel, confirmationCode:string){
        const newUser = await usersService.createUser({...body, confirmationCode, isConfirmed:false});
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

    async checkPassword(userPassword:string, enteredPassword: string) {
        return await bcrypt.compare(enteredPassword,userPassword );
    },
    async checkConfirmationCode(code:string) {
        let user = await usersRepository.findUserByConfirmationCode(code)

        if(user && !user.registrationData.isConfirmed && user.registrationData.expirationDate.toString() > moment().toString()){
            try {
                let result = await UsersModelClass.updateOne(
                    { _id: user._id },
                    {$set: {'registrationData.isConfirmed': true}}
                );
                return result.matchedCount == 1;
            } catch (e) {
                return false;
            }
        } else {
            return false
        }
    },


}