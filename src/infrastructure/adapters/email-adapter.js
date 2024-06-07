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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailAdapter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.emailAdapter = {
    sendEmail({ to, subject, htmlMessage, senderName }) {
        return __awaiter(this, void 0, void 0, function* () {
            let transport = nodemailer_1.default.createTransport({
                service: 'Mail.ru',
                auth: {
                    user: "Smirnov.ru92@mail.ru",
                    pass: "xqfWd2w5KfGyjPeuFfLD" // Пароль приложения
                }
            });
            const info = yield transport.sendMail({
                from: `${senderName} <Smirnov.ru92@mail.ru>`,
                to,
                subject,
                html: htmlMessage //сообщение
            });
            return info;
        });
    }
};
