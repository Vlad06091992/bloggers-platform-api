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
exports.isExistingPost = void 0;
const http_statuses_1 = require("../http_statuses/http_statuses");
const posts_service_1 = require("../features/posts/posts-service");
const isExistingPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield posts_service_1.postsService.findPostById(req.params.id);
    if (result) {
        next();
    }
    else {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
});
exports.isExistingPost = isExistingPost;
