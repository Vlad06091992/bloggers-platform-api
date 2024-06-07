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
exports.attemptsMiddleware = void 0;
const moment_1 = __importDefault(require("moment"));
const apiCallHistory_repository_1 = require("../features/apiCallHistory/apiCallHistory-repository");
const http_statuses_1 = require("../http_statuses/http_statuses");
//TODO количество попыток обращения с одного ип адреса
const attemptsMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const IP = req.ip;
    const URL = req.url;
    const date = (0, moment_1.default)().format();
    const dateToNumber = (0, moment_1.default)().valueOf();
    const requestTimeInterval = 10;
    yield apiCallHistory_repository_1.ApiCallHistoryRepository.recordAPICall({ IP, URL, date, dateToNumber });
    const attempts = yield apiCallHistory_repository_1.ApiCallHistoryRepository.countRequests(IP, URL, requestTimeInterval);
    attempts > 5 ? res.sendStatus(http_statuses_1.HTTP_STATUSES.MANY_ATTEMPTS) : next();
});
exports.attemptsMiddleware = attemptsMiddleware;
