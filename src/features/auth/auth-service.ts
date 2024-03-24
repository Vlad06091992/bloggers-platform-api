import {UserType, UserViewModel} from "../users/types/types";
import {WithId} from "mongodb";
import bcrypt from "bcrypt";


export const authService = {

    //получаем юзера/сравниваем пароли

    async checkPassword(userPassword:string, enteredPassword: string) {
        return await bcrypt.compare(enteredPassword,userPassword );
    }
}