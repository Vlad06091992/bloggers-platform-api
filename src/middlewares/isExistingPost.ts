import {NextFunction, Response} from "express";
import {HTTP_STATUSES} from "../http_statuses/http_statuses";
import {postsService} from "../features/posts/posts-service";

export const isExistingPost = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    let result = await postsService.findPostById(req.params.id);
    if (result) {
        next();
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
};