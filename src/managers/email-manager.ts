import {emailAdapter, sendEmailOptions} from "../adapters/email-adapter";
import {WithId} from "mongodb";
import {UserType, UserViewModel} from "../features/users/types/types";

export const emailManager = {
    async sendEmailRecoveryPassword(email: string, recoveryCode: string) {

        const htmlMessage = ` <h1>Recovery password</h1>
 <p>To finish recovery password please follow the link below:
     <a href='https://somesite.com/confirm-email?recoveryCode=${recoveryCode}'>recovery password</a>
 </p>`
        const senderName = "BLOGGERS-API"
        const subject = "Recovery password"
        await emailAdapter.sendEmail({to: email, htmlMessage, senderName, subject})
    },
    async sendEmailConfirmationMessage(user: UserViewModel, confirmationCode: string) {
        const email = user.email
        const htmlMessage = ` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
 </p>`
        const senderName = "BLOGGERS-API"
        const subject = "Registration"

        await emailAdapter.sendEmail({to: email, htmlMessage, senderName, subject})
    }

    //...other functional for email sendings
}