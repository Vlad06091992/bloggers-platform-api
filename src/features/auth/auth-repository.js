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
exports.AuthRepository = void 0;
const models_1 = require("../../mongoose/models");
const mongodb_1 = require("mongodb");
exports.AuthRepository = {
    findToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.TokensBlacklistModelClass.findOne({ token });
            }
            catch (e) {
                return null;
            }
        });
    },
    putTokenInBlackList(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenWithPrefixId = {
                _id: new mongodb_1.ObjectId(),
                token: data.token
            };
            return yield models_1.TokensBlacklistModelClass.create(tokenWithPrefixId);
        });
    },
    clearAllBlackList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.TokensBlacklistModelClass.deleteMany({});
            return true;
        });
    }
};
