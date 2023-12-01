import {validationResult} from "express-validator";
import {HTTP_STATUSES} from "../http_statuses/http_statuses";
import {createErrorResponse} from "../utils";
import {NextFunction, Request,Response} from "express";

export const validateErrors = (req: Request, res: Response, next: NextFunction) => {
    debugger
    const errors = validationResult(req).array({onlyFirstError: true});
    if (errors.length) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(createErrorResponse(errors))
    } else {
        next()
    }
}