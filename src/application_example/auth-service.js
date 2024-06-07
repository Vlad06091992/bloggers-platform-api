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
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_repository_1 = require("src/features/users/users-repository");
const moment_1 = __importDefault(require("moment"));
const models_1 = require("src/mongoose/models");
const users_service_1 = require("src/application_example/users-service");
const email_manager_1 = require("src/application_example/managers/email-manager");
const uuid_1 = require("uuid");
exports.authService = {
    createUser(body, confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield users_service_1.usersService.createUser(Object.assign(Object.assign({}, body), { confirmationCode, isConfirmed: false }));
            yield email_manager_1.emailManager.sendEmailConfirmationMessage(newUser, confirmationCode);
        });
    },
    resendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findUserByLoginOrEmail(email);
            if (user && !user.registrationData.isConfirmed) {
                const confirmationCode = (0, uuid_1.v4)();
                const expirationDate = (0, moment_1.default)().add(1, 'hour').toString();
                const userViewModel = users_service_1.usersService.getUserWithPrefixIdToViewModel(user);
                yield email_manager_1.emailManager.sendEmailConfirmationMessage(userViewModel, confirmationCode);
                try {
                    let result = yield models_1.UsersModelClass.updateOne({ _id: user._id }, {
                        $set: {
                            'registrationData.confirmationCode': confirmationCode,
                            'registrationData.expirationDate': expirationDate
                        }
                    });
                    return result.matchedCount == 1;
                }
                catch (e) {
                    return false;
                }
            }
            else {
                return false;
            }
        });
    },
    checkPassword(userPassword, enteredPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(enteredPassword, userPassword);
        });
    },
    checkConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findUserByConfirmationCode(code);
            if (!user)
                return false;
            if (user.canBeConfirmed()) {
                try {
                    let result = yield models_1.UsersModelClass.updateOne({ _id: user._id }, { $set: { 'registrationData.isConfirmed': true } });
                    return result.matchedCount == 1;
                }
                catch (e) {
                    return false;
                }
            }
        });
    },
};
