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
exports.blogsRepository = void 0;
const mongodb_1 = require("mongodb");
const blogs_service_1 = require("../blogs/blogs-service");
const models_1 = require("../../mongoose/models");
exports.blogsRepository = {
    findBlogs(reqQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (reqQuery.searchNameTerm) {
                filter = { name: { $regex: reqQuery.searchNameTerm, $options: "i" } };
            }
            const sortBy = reqQuery.sortBy || "createdAt";
            const sortDirection = reqQuery.sortDirection || "desc";
            const pageNumber = reqQuery.pageNumber || 1;
            const pageSize = reqQuery.pageSize || 10;
            const totalCount = yield models_1.BlogModelClass.countDocuments(filter);
            //@ts-ignore
            return yield models_1.BlogModelClass.pagination(filter, pageNumber, pageSize, sortBy, sortDirection, totalCount, blogs_service_1.blogsService.getBlogWithPrefixIdToViewModel);
        });
    },
    createBlog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = yield models_1.BlogModelClass.create(data);
            return {
                id: data._id.toString(),
                createdAt: data.createdAt,
                description: data.description,
                name: data.name,
                websiteUrl: data.websiteUrl,
                isMembership: data.isMembership,
            };
        });
    },
    updateBlog(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.BlogModelClass.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: data });
                return result.matchedCount == 1;
            }
            catch (e) {
                return false;
            }
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.BlogModelClass.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                return result.deletedCount === 1;
            }
            catch (e) {
                return false;
            }
        });
    },
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.BlogModelClass.deleteMany({});
            return true;
        });
    },
};
