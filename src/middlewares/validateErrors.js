"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateErrors = void 0;
const express_validator_1 = require("express-validator");
const http_statuses_1 = require("../http_statuses/http_statuses");
const utils_1 = require("../utils");
const validateErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length) {
        res.status(http_statuses_1.HTTP_STATUSES.BAD_REQUEST_400).send((0, utils_1.createErrorResponse)(errors));
    }
    else {
        next();
    }
};
exports.validateErrors = validateErrors;
