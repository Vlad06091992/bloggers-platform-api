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
exports.getUsersRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateCreateUserData_1 = require("./validators/validateCreateUserData");
const users_service_1 = require("src/application_example/users-service");
const validateErrors_1 = require("../../middlewares/validateErrors");
const http_statuses_1 = require("../../http_statuses/http_statuses");
const users_repository_1 = require("./users-repository");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const getUsersRouter = () => {
    const router = express_1.default.Router();
    router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let foundedUsers = yield users_repository_1.usersRepository.findUsers(req.query);
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(foundedUsers);
    }));
    router.post("/", authMiddleware_1.authMiddleware, validateCreateUserData_1.validateCreateUserData, validateErrors_1.validateErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let newUser = yield users_service_1.usersService.createUser(Object.assign(Object.assign({}, req.body), { isConfirmed: true }));
        res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(newUser);
    }));
    router.delete("/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const isDeleted = yield users_service_1.usersService.deleteUser(req.params.id);
        if (isDeleted) {
            res.send(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.send(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    }));
    // router.get(
    //   "/:id",
    //   async (
    //     req: RequestWithParams<URIParamsPostIdModel>,
    //     res: Response<UserViewModel | number>,
    //   ) => {
    //     const post = await commentsService.getPostById(req.params.id);
    //     if (post) {
    //       res.send(post);
    //     } else {
    //       res.send(HTTP_STATUSES.NOT_FOUND_404);
    //     }
    //   },
    // );
    //
    // router.put(
    //   "/:id",
    //   authMiddleware,
    //   validateCreatePostDataWithIdParams,
    //   validateErrors,
    //   async (
    //     req: RequestWithParamsAndBody<URIParamsPostIdModel, PostUpdateModel>,
    //     res: Response<PostViewModel | number>,
    //   ) => {
    //     const isExistsPost = await commentsService.getPostById(req.params.id);
    //     if (!isExistsPost) {
    //       res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    //       return;
    //     }
    //     await commentsRepository.updatePost(req.params.id, req.body);
    //     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    //   },
    // );
    return router;
};
exports.getUsersRouter = getUsersRouter;
