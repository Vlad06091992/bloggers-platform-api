import {UserModelInstanceMethods, UserSchemaType, UserType} from "./users-types";
import moment from "moment";
import {User} from "../application_example/users-service";
import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema<UserType, UserSchemaType, UserModelInstanceMethods>({
    _id: {type: mongoose.Schema.Types.ObjectId},
    email: {type: String, require: true},
    password: {type: String, require: true},
    login: {type: String, require: true},
    createdAt: {type: String, require: true},
    registrationData: {
        confirmationCode: {type: String, require: true},
        isConfirmed: {type: Boolean, require: true},
        expirationDate: {type: String, require: true},

    }
})
UserSchema.method('canBeConfirmed', function () {
    const that = this as unknown as UserType & UserModelInstanceMethods
    return !that.registrationData.isConfirmed && that.registrationData.expirationDate.toString() > moment().toString()
}) //создается у экземпляра

UserSchema.method('confirm', function () {
    const that = this as unknown as UserType & UserModelInstanceMethods
    if (!that.canBeConfirmed()) throw new Error("Account can't be confirmed")
    if (that.registrationData.isConfirmed) throw new Error("Already confirmed account can't be confirmed again")
    that.registrationData.isConfirmed = true
})


UserSchema.method('changeLogin', function (login: string) {
    const that = this as unknown as UserType & UserModelInstanceMethods
    that.login = login
})

UserSchema.static('makeInstance', async function (email: string, password: string, login: string) {
    const newUser = new User(email, login, password)
    const result = await this.create(newUser)
    debugger
    console.log(result)
    return result
}) //создается у класса

// UserSchema.statics.makeInstance = async function (email: string, password: string, login: string) {
//     const newUser = new User(email, login, password)
//     const result = await this.create(newUser)
//     debugger
//     console.log(result)
//     return result
// } //создается у класса

