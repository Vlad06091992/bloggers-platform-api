import {NextFunction, Request, Response} from "express";
import moment from "moment";
import {ApiCallHistoryRepository} from "../features/apiCallHistory/apiCallHistory-repository";
import {HTTP_STATUSES} from "../http_statuses/http_statuses";

//TODO количество попыток обращения с одного ип адреса

export const attemptsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
debugger
    const IP = req.ip!
    const URL = req.url
    const date = moment().format()
    const dateToNumber = moment().valueOf()
    const requestTimeInterval = 10
    await ApiCallHistoryRepository.recordAPICall({IP, URL, date, dateToNumber})
    const attempts= await ApiCallHistoryRepository.countRequests(IP,URL,requestTimeInterval)
    attempts > 5 ? res.sendStatus(HTTP_STATUSES.MANY_ATTEMPTS) : next()
};