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
exports.pagination = exports.createErrorResponse = void 0;
function createErrorResponse(errors) {
    return {
        errorsMessages: errors.map((el) => ({
            message: el.msg,
            field: el.path,
        })),
    };
}
exports.createErrorResponse = createErrorResponse;
function pagination(filter, pageNumber, pageSize, sortBy, sortDirection, totalCount, map_callbak) {
    return __awaiter(this, void 0, void 0, function* () {
        //@ts-ignore
        const res = yield this.find(filter)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ [sortBy]: sortDirection == "asc" ? 1 : -1 }).lean();
        return {
            pagesCount: Math.ceil(+totalCount / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: res.map(map_callbak),
        };
    });
}
exports.pagination = pagination;
;
