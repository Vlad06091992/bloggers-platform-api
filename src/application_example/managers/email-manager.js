"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailManager = void 0;
const email_adapter_1 = require("src/infrastructure/adapters/email-adapter");
exports.emailManager = {
    sendEmailRecoveryPassword(options) {
        return __awaiter(this, void 0, void 0, function* () {
            email_adapter_1.emailAdapter.sendEmail(options);
        });
    },
    sendEmailConfirmationMessage(user, confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = user.email;
            const htmlMessage = ` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
 </p>`;
            const senderName = "BLOGGERS-API";
            const subject = "Registration";
            yield email_adapter_1.emailAdapter.sendEmail({ to: email, htmlMessage, senderName, subject });
        });
    }
    //...other functional for email sendings
};
